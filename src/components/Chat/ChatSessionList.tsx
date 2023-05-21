'use client'

import { ChatSessionItemById } from '@/components/Chat/ChatSessionItem'
import Styles from './ChatSessionList.module.scss'
import { useContext, useEffect, useState } from 'react'
import Chat from '@/model/Chat'
import axios from 'axios'
import CurrentUserInfoContext from '@/context/CurrentUserInfoContext'
import { useRouter } from 'next/navigation'

export default function ChatSessionList () {
	const [chats, setChats] = useState<Chat[]>([])
	const curentUser = useContext(CurrentUserInfoContext)
	const router = useRouter()
	useEffect(() => {
		axios.get<Chat[]>('http://localhost:8080/api/user/chat/getAllSession')
			.then(r => {
				if (r.status === 200) {
					setChats(r.data)
				}
			})
	}, [])

	let list = chats.map(t => {
		let id = t.users.filter(i => i.localeCompare(curentUser!.user!.id))[0]
		return (
			<div key={t.id} onClick={() => {
				router.push(`/chat/${id}`)
			}}>
				<ChatSessionItemById id={id} session={t}/>
			</div>
		)
	})

	return (
		<div className={`overflow-y-scroll h-full pr-1 ${Styles.scrollbar__less}`}>
			{
				list
			}
		</div>
	)
}

