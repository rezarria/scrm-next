import {createContext, Dispatch, SetStateAction} from 'react'
import UserInfo from '@/model/UserInfo'

const CurrentUserInfoContext = createContext<{
	user: UserInfo
	setUser: Dispatch<SetStateAction<UserInfo | null>>
} | null>(null)

export default CurrentUserInfoContext