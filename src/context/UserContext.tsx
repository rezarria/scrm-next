'use client'

import { createContext, ReactNode, useMemo } from 'react'
import UserInfo from '@/model/UserInfo'
import createNewContext from '@/context/NewUserContext'

export interface UserContextState {
	getUser: (id: string) => Promise<UserInfo | null | undefined>
	getUsers: (id: string[]) => Promise<UserInfo[] | undefined>
}

const UserContext = createContext<UserContextState | null>(null)

export default UserContext


interface UserContextProviderProps {
	children: ReactNode
}

export function UserContextProvider (props: UserContextProviderProps) {
	const userContext2: UserContextState = useMemo(() => {
		const context = createNewContext<UserInfo>()

		let a: UserContextState = {
			getUser: context.get,
			getUsers: context.getMany
		}
		return a
	}, [])
	return (
		<UserContext.Provider value={userContext2}>
			{
				props.children
			}
		</UserContext.Provider>
	)
}