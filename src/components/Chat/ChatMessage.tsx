'use client'

import UserInfo from '@/model/UserInfo'
import Image from 'next/image'
import { useContext, useEffect, useState } from 'react'
import UserContext from '@/context/UserContext'

interface Props {
	content: string
	left: boolean
	showAvatar?: boolean
	userId: string
}

export default function ChatMessage (props: Props) {
	const userContext = useContext(UserContext)
	const [loading, setLoading] = useState(true)
	const [userInfo, setUserInfo] = useState<UserInfo>()
	useEffect(() => {
		userContext?.getUser(props.userId).then(u => {
			if (u != null) {
				setUserInfo(u)
				setLoading(false)
			}
		})
	}, [])

	if (loading) return <p>loading...</p>

	return (
		<div className={`flex flex-row gap-2 ${props.left ? 'justify-start' : 'flex-row-reverse'}`}>
			{
				!(props.showAvatar !== undefined && !props.showAvatar) &&
				<div className='rounded-full w-8 h-8 bg-black overflow-hidden'>
					{
						userInfo!.avatar != null && userInfo!.avatar.length != 0 &&
						<Image className='w-full h-full object-cover' width={50} height={50} src={userInfo!.avatar}
							   alt='avatar'/>
					}
				</div>
			}
			<div className='rounded bg-white p-2 max-w-[40%] border'>
				<p className='w-full break-words'>{props.content}</p>
			</div>
		</div>
	)
}