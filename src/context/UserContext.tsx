import { createContext, ReactNode, useRef } from 'react'
import UserInfo from '@/model/UserInfo'
import axios from 'axios'

export interface UserContextState {
	getUser: (id: string) => Promise<UserInfo | null | undefined>
}

const UserContext = createContext<UserContextState | null>(null)

export default UserContext


interface UserContextProviderProps {
	children: ReactNode
}

export function UserContextProvider (props: UserContextProviderProps) {
	const users = useRef<UserInfo[]>([])
	const job = useRef<{ task: Promise<UserInfo | null | undefined> | null }>({task: null})
	let userContextValue: UserContextState = {
		getUser: async id => {
			console.log('bắt đầu truy vấn')
			let user = users.current.find(x => x.id === id)
			if (user !== undefined) return user
			console.log('không tìm thấy user trong cache, truy vấn api')

			while (true) {
				if (job.current.task !== null) {
					console.log('đang có bên khác yêu cầu. đợi....')
					await job.current.task
					console.log('đợi xong...')
				}

				user = users.current.find(x => x.id === id)
				if (user === undefined) break
				console.log(`${id} đã được lấy từ yêu cầu khác, huỷ truy vấn api`)
				return user
			}

			console.log(`bắt đầu truy vấn thông tin với id ${id}`)
			job.current.task = axios.get<UserInfo>(`http://localhost:8080/api/user/info?id=${id}`)
				.then(r => {
					if (r.status === 200) {
						users.current.push(r.data)
						return r.data
					}
					return null
				}).finally(() => {
					job.current.task = null
				})

			return await job.current.task
		}
	}
	return (
		<UserContext.Provider value={userContextValue}>
			{
				props.children
			}
		</UserContext.Provider>
	)
}