'use client'

import {ReactNode} from 'react'
import ChatSessionList from '@/components/Chat/ChatSessionList'

interface Props {
	children: ReactNode
}

export default function Layout (props: Props) {
	return (
		<div className='flex flex-row h-screen'>
			<div className='w-[300px] h-full border-r-2'><ChatSessionList/></div>
			<div className='flex-grow'>{props.children}</div>
		</div>
	)
}