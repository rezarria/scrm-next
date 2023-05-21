'use client'

import {useContext, useEffect, useState} from 'react'
import UserContext from '@/context/UserContext'
import UserInfo from '@/model/UserInfo'
import Image from 'next/image'

interface Props {
	name: string
	avatar: string
	onClick?: Function
}

export default function ChatSessionItem (props: Props) {
	return <div className='flex flex-row gap-2 p-2 cursor-pointer rounded-r hover:bg-blue-400'>
		<div className='rounded-full w-12 h-12 bg-black overflow-hidden'>
			{
				props.avatar != null && props.avatar.length != 0 && <Image className='w-full h-full object-cover' src={props.avatar} alt='avatar' width='300' height='300'/>
			}
		</div>
		<div className='flex-col'>
			<div className='font-semibold'>{props.name}</div>
			<div className='text-sm'></div>
		</div>
	</div>
}

interface ChatSessionItemByIdProps {
	id: string
}

export function ChatSessionItemById (props: ChatSessionItemByIdProps) {
	let context = useContext(UserContext)
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
	useEffect(() => {
		if (context !== null) context.getUser(props.id).then(u => {
			if (u != null)
				setUserInfo(u)
		})
	}, [props.id])
	if (context === null || userInfo == null)
		return <p>loading....</p>
	return <>
		<ChatSessionItem name={userInfo.fullName} avatar={userInfo.avatar}/>
	</>
}