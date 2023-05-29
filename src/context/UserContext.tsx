import { createContext, ReactNode, useMemo, useRef } from 'react'
import UserInfo from '@/model/UserInfo'
import axios from 'axios'

export interface UserContextState {
	getUser: (id: string) => Promise<UserInfo | null | undefined>
	getUsers: (id: string[]) => Promise<UserInfo[]>
}

const UserContext = createContext<UserContextState | null>(null)

export default UserContext


interface UserContextProviderProps {
	children: ReactNode
}

export function UserContextProvider (props: UserContextProviderProps) {
	const users = useRef<UserInfo[]>([])
	const userContextValue: UserContextState = useMemo(() => {
		let job: {
			task: Promise<UserInfo | UserInfo[] | null | undefined> | null
			lock: boolean
		} = {task: null, lock: false}
		return ({
			getUser: async id => {
				console.log('bắt đầu truy vấn')
				let user = users.current.find(x => x.id === id)
				if (user !== undefined) return user
				console.log('không tìm thấy user trong cache, truy vấn api')

				while (job.lock) {
				}

				job.lock = true

				if (job.task !== null) {
					console.log('đang có bên khác yêu cầu. đợi....')
					await job.task
					console.log('đợi xong...')
				}

				user = users.current.find(x => x.id === id)
				if (user !== undefined) {
					console.log(`${id} đã được lấy từ yêu cầu khác, huỷ truy vấn api`)
					return user
				}

				console.log(`bắt đầu truy vấn thông tin với id ${id}`)
				job.task = axios.get<UserInfo>(`http://localhost:8080/api/user/info?id=${id}`)
					.then(r => {
						if (r.status === 200) {
							users.current.push(r.data)
							return r.data
						}
						return null
					}).finally(() => {
						job.task = null
						job.lock = false
					})

				return await job.task as UserInfo
			},
			getUsers: async id => {
				let foundUsers = users.current.filter(i => id.includes(i.id))
				if (id.length === foundUsers.length) return foundUsers
				let foundIdList = foundUsers.map(i => i.id)
				let missingIdList = id.filter(i => !foundIdList.includes(i))

				if (job.task !== null)
					await job.task
				foundUsers.push(...users.current.filter(i => missingIdList.includes(i.id)))

				if (foundUsers.length === id.length)
					return foundUsers

				foundIdList = foundUsers.map(i => i.id)
				missingIdList = id.filter(i => !foundIdList.includes(i))
				job.task = axios.post<UserInfo[]>('http://localhost:8080/api/user/info', {
					id: missingIdList
				})
					.then(r => {
						if (r.status === 200) {
							users.current.push(...r.data)
							return [...foundUsers, ...r.data]
						}
						return null
					}).finally(() => {
						job.task = null
					})

				return await job.task as UserInfo[]
			}
		})
	}, [])
	return (
		<UserContext.Provider value={userContextValue}>
			{
				props.children
			}
		</UserContext.Provider>
	)
}