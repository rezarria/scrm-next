'use client'

import { ReactNode, useContext, useEffect, useState } from 'react'
import UserContext from '@/context/UserContext'
import UserInfo from '@/model/UserInfo'
import Image from 'next/image'
import Chat from '@/model/Chat'
import CurrentUserInfoContext from '@/context/CurrentUserInfoContext'

interface Props {
	name: string
	avatar: string
	avatarNode?: ReactNode | null
	onClick?: Function
}

export default function ChatSessionItem (props: Props) {
	return <div className='flex flex-row gap-2 p-2 cursor-pointer rounded-r hover:bg-blue-400'>
		<div className='rounded-full w-12 h-12 bg-black overflow-hidden'>
			{
				props.avatarNode == null && props.avatar != null && props.avatar.length != 0 &&
                <Image className='w-full h-full object-cover' src={props.avatar} alt='avatar' width='300' height='300'/>
			}
			{
				props.avatarNode != null && props.avatarNode
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
	session: Chat
}

export function ChatSessionItemById (props: ChatSessionItemByIdProps) {
	let context = useContext(UserContext)
	let currentUser = useContext(CurrentUserInfoContext)
	const [loading, setLoading] = useState(true)
	const [userInfo, setUserInfo] = useState<UserInfo[]>([])

	useEffect(() => {
		let id = props.session.users.find(i => i.localeCompare(currentUser!.user.id) !== 0)
		if (id === undefined) throw ''
		if (context !== null && currentUser != null) {
			context.getUsers(props.session.users.filter(i => i.localeCompare(currentUser!.user.id) != 0))
				.then(t => {
					if (t != null) {
						setUserInfo(t)
						setLoading(false)
					}
				})
		}
	}, [context, currentUser, props.id, props.session.lastModifiedDate, props.session.users])

	if (context === null || userInfo == null || loading)
		return <p>loading....</p>

	let itemName = ''
	let avatar = ''
	let avatarNode: ReactNode | null = null

	if (props.session.name.length != 0)
		itemName = props.session.name
	else if (userInfo.length > 1)
		itemName = userInfo.map(i => i.fullName).join(', ')
	else
		itemName = userInfo[0].fullName

	if (userInfo.length > 1)
		avatarNode = <>
			<div className='w-full h-full flex flex-row justify-center items-center'>
				{
					userInfo.map(u => (
						<div key={u.id} className='h-full w-1/2 overflow-hidden'>
							{
								u.avatar && u.avatar.length != 0 &&
                                <Image className='w-full h-full object-cover' src={u.avatar} width={200} height={200}
                                       alt='avatar'/>
							}
						</div>
					))
				}
			</div>
		</>
	else
		avatar = userInfo[0].avatar
	return <>
		<ChatSessionItem name={itemName} avatar={avatar} avatarNode={avatarNode}/>
	</>
}