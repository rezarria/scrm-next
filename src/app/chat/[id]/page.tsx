'use client'

import ChatSessionContent from '@/components/Chat/ChatSessionContent'
import { useContext, useEffect, useState } from 'react'
import userContext from '@/context/UserContext'
import UserInfo from '@/model/UserInfo'
import { InputArea } from '@/components/Chat/InputArea'
import ChatSessionContext from '@/context/ChatSessionContext'
import Chat from '@/model/Chat'
import CurrentUserInfoContext from '@/context/CurrentUserInfoContext'
import { Header } from '@/components/Chat/Header'

interface PageProps {
	params: {
		id: string
	}
}

export default function Page (props: PageProps) {
	const userInfoContext = useContext(userContext)
	const currentUser = useContext(CurrentUserInfoContext)
	const sessionContext = useContext(ChatSessionContext)
	const [userInfo, setUserInfo] = useState<UserInfo[]>([])
	const [session, setSession] = useState<Chat>()
	const [loading, setLoading] = useState(true)
	const [force, setForce] = useState(true)

	useEffect(() => {

		const forceRender = () => {
			setForce(!force)
		}

		if (sessionContext) {
			sessionContext.subscribe(forceRender)
		}

		if (sessionContext != null) {
			sessionContext.getSession(props.params.id).then(d => {
				if (d != null) {
					setSession(d)
					if (userInfoContext && currentUser) {
						let userIds = d.users.filter(i => i.localeCompare(currentUser.user.id))
						userInfoContext.getUsers(userIds).then(value => {
							if (value != null) {
								setUserInfo(value)
								setLoading(false)
							}
						})

					}
				}
			})
		}
		return () => {
			sessionContext?.unsubscribe(forceRender)
		}
	}, [props.params.id])

	if (loading) return <h1>Loading...</h1>

	let headerName = ''
	if (session!.name.length != 0)
		headerName = session?.name!
	else if (userInfo.length > 1) {
		headerName = userInfo.map(i => i.fullName).join(', ')
	} else
		headerName = userInfo[0].fullName


	return (
		<div className='flex flex-col h-full'>
			<Header name={headerName} chatId={props.params.id}/>
			<div className='flex flex-col flex-grow h-[400px]'>
				<ChatSessionContent session={session!}/>
				<div className='p-2 min-h-fit border-t'>
					<InputArea id={props.params.id}/>
				</div>
			</div>
		</div>
	)
}