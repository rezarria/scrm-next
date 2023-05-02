import {createContext} from 'react'
import UserInfo from '@/model/UserInfo'

const UserInfoContext = createContext<UserInfo | null>(null)

export default UserInfoContext