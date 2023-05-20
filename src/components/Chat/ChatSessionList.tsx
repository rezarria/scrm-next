'use client'

import ChatSessionItem from '@/components/Chat/ChatSessionItem'
import Styles from './ChatSessionList.module.scss'
import Link from 'next/link'
import {useState} from 'react'
import Chat from '@/model/Chat'
import axios from 'axios'

export default function ChatSessionList () {
	const [chats, setChats] = useState<Chat[]>([])


	return (
		<div className={`overflow-y-scroll h-full pr-1 ${Styles.scrollbar__less}`}>
			{
				chats.map(t => <Link key={t.id} href={`chat/${t}/`}><ChatSessionItem key={t.id} name={t.name}/></Link>)
			}
		</div>
	)
}

function getInfoFromApi() {
	axios.post()
}