import {createContext, Dispatch, SetStateAction} from 'react'
import UserInfo from '@/model/UserInfo'
import axios from 'axios'

export interface UserContextState {
	users: UserInfo[],
	getUser: (id: string) => Promise<UserInfo | null>
	setUsers: (users: UserInfo[]) => void
	addUsers: (user: UserInfo) => void
	deleteUser: (user: UserInfo) => void
}

export function createInit (init: {
	users: UserInfo[]
	setUsers: Dispatch<SetStateAction<UserInfo[]>>
}): UserContextState {
	return {
		users: init.users,
		getUser: id => axios.get<UserInfo>(`http://localhost:8080/api/user/info?id=${id}`)
			.then(r => {
				if (r.status === 200) {
					init.setUsers([...init.users, r.data])
					return r.data
				}
				return null
			}),
		setUsers: (u) => init.setUsers(u),
		addUsers: u => init.setUsers([...init.users, u]),
		deleteUser: u => init.setUsers(init.users.filter(i => i !== u))
	}
}

const UserContext = createContext<UserContextState | null>(null)

export default UserContext