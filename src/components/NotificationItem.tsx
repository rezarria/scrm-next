import Notification, { Mode } from '@/model/Notification'
import { useContext, useEffect, useState } from 'react'
import UserContext from '@/context/UserContext'
import UserInfo from '@/model/UserInfo'
import axios from 'axios'
import FriendRequest from '@/model/FriendRequest'
import Image from 'next/image'

interface Props {
	notificationData: Notification
}

export default function NotificationItem (props: Props) {
	const context = useContext(UserContext)
	const [icon, setIcon] = useState('')
	const [content, setContext] = useState('')
	if (context === null) throw 'context rỗng'
	const [user, setUser] = useState<UserInfo | null>(null)
	useEffect(() => {

		switch (Mode[props.notificationData.mode]) {
			case Mode.FriendRequest: {
				axios.get<FriendRequest>('http://localhost:8080/api/user/friend/getInfo', {
					params: {
						id: props.notificationData.relId
					}
				})
					.then(r => {
						if (r.status === 200) {
							context.getUser(r.data.to).then(d => {
								if (d) {
									setIcon(d.avatar)
									setContext(`Lời mời kết bạn từ ${d.fullName}`)
								}
							})
						}
					})
				break
			}
			case Mode.Custom: {
				setIcon(props.notificationData.icon)
				setContext(props.notificationData.content)
				break
			}
		}
	}, [])

	return (
		<div className='group p-2 hover:bg-blue-500 hover:duration-100 duration-300 flex flex-row items-center gap-2'>
			<div
				className='w-10 h-10 block bg-amber-100 rounded-full group-hover:border group-hover:border-black'>
				{
					icon && icon.length != 0 && <Image src={icon} height={300} width={300} alt={'avatar'}/>
				}
			</div>
			<div>{content}</div>
		</div>
	)
}