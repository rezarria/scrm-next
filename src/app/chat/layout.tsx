'use client'

import { ReactNode } from 'react'
import ChatSessionList from '@/components/Chat/ChatSessionList'
import CreateNewSession from '@/components/Chat/CreateNewSession'
import PrivateRoute from '@/router/PrivateRoute'
import { UserContextProvider } from '@/context/UserContext'

interface Props {
	children: ReactNode
}

export default function Layout (props: Props) {
	return (
		<PrivateRoute>
			<UserContextProvider>
				<div className='flex flex-row h-screen'>
					<div className='w-[300px] h-full border-r-2 flex flex-col'>
						<CreateNewSession/>
						<ChatSessionList/>
					</div>
					<div className='flex-grow'>{props.children}</div>
				</div>
			</UserContextProvider>
		</PrivateRoute>
	)
}