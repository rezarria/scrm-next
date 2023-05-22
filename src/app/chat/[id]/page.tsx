'use client'

import ChatSessionContent from '@/components/Chat/ChatSessionContent'
import { useContext, useEffect, useState } from 'react'
import userContext from '@/context/UserContext'
import UserInfo from '@/model/UserInfo'
import { InputArea } from '@/components/Chat/InputArea'
import ChatSessionContext from '@/context/ChatSessionContext'
import Chat from '@/model/Chat'
import CurrentUserInfoContext from '@/context/CurrentUserInfoContext'

interface PageProps {
	params: {
		id: string
	}
}

function Header ({name}: { name: string }) {
	return <div className='w-full border-b flex flex-row justify-between items-center p-2'>
		<div className='text-xl'>{name}</div>
		<div>Cài đặt</div>
	</div>
}

export default function Page (props: PageProps) {
	const userInfoContext = useContext(userContext)
	const currentUser = useContext(CurrentUserInfoContext)
	const sessionContext = useContext(ChatSessionContext)
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
	const [session, setSession] = useState<Chat>()
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (sessionContext != null) {
			sessionContext.getSession(props.params.id).then(d => {
				if (d != null) {
					setSession(d)
					if (userInfoContext && currentUser) {
						userInfoContext.getUser(d.users.filter(i => i.localeCompare(currentUser.user.id))[0])
							.then(u => {
								if (u) {
									setUserInfo(u)
									setLoading(false)
								}
							})
					}
				}
			})
		}
	}, [props.params.id, sessionContext])

	if (loading) return <h1>Loading...</h1>

	return (
		<div className='flex flex-col h-full'>
			<Header name={userInfo!.fullName}/>
			<div className='flex flex-col flex-grow h-[400px]'>
				<ChatSessionContent session={session!}/>
				<div className='p-2 min-h-fit border-t'>
					<InputArea id={props.params.id}/>
				</div>
			</div>
		</div>
	)
}