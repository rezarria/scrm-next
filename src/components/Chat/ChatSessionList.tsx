'use client'

import {ChatSessionItemById} from '@/components/Chat/ChatSessionItem'
import Styles from './ChatSessionList.module.scss'
import {useContext, useEffect, useState} from 'react'
import Chat from '@/model/Chat'
import axios from 'axios'
import userContext from '@/context/UserContext'
import CurrentUserInfoContext from '@/context/CurrentUserInfoContext'

export default function ChatSessionList () {
	const [chats, setChats] = useState<Chat[]>([])
	const curentUser = useContext(CurrentUserInfoContext)
	useEffect(() => {
		axios.get<Chat[]>('http://localhost:8080/api/user/chat/getAllSession')
			.then(r => {
				if (r.status === 200) {
					setChats(r.data)
				}
			})
	}, [])

	return (
		<div className={`overflow-y-scroll h-full pr-1 ${Styles.scrollbar__less}`}>
			{
				chats.map(t => <a key={t.id} href={`chat/${t}/`}><ChatSessionItemById key={t.id} id={t.users.filter(i=>i.localeCompare(curentUser!.user!.id))[0]}/></a>)
			}
		</div>
	)
}

