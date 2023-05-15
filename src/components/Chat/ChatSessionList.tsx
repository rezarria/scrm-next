'use client'

import ChatSessionItem from '@/components/Chat/ChatSessionItem'
import Styles from './ChatSessionList.module.scss'
import Link from 'next/link'

export default function ChatSessionList () {
	return (
		<div className={`overflow-y-scroll h-full pr-1 ${Styles.scrollbar__less}`}>
			{
				[1, 2, 3, 4, 5].map(t => <Link key={t} href={`chat/${t}/`}><ChatSessionItem key={t}/></Link>)
			}
		</div>
	)
}