'use client'

import { ChatSessionItemById } from '@/components/Chat/ChatSessionItem'
import Styles from './ChatSessionList.module.scss'
import { useContext, useEffect, useState } from 'react'
import Chat from '@/model/Chat'
import CurrentUserInfoContext from '@/context/CurrentUserInfoContext'
import { useRouter } from 'next/navigation'
import ChatSessionContext from '@/context/ChatSessionContext'

export default function ChatSessionList () {
	const [chats, setChats] = useState<Chat[]>([])
	const sessionContext = useContext(ChatSessionContext)
	const curentUser = useContext(CurrentUserInfoContext)
	const router = useRouter()
	const [load, setLoad] = useState(true)

	useEffect(() => {
		const callback = () => {
			console.log('render!')
			setLoad(!load)
			setChats(sessionContext!.getAll())
		}
		sessionContext!.subscribe(callback)
		return () => {
			sessionContext!.unsubscribe(callback)
		}
	}, [sessionContext])

	let list = chats.map(t => {
		let id = t.id
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

