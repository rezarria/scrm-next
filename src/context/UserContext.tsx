import {createContext} from 'react'
import UserInfo from '@/model/UserInfo'

export interface UserContextState {
	getUser: (id: string) => Promise<UserInfo | null | undefined>
}

const UserContext = createContext<UserContextState | null>(null)

export default UserContext