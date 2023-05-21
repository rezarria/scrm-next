'use client'

import ChatSessionContent from '@/components/Chat/ChatSessionContent'
import { useContext, useEffect, useState } from 'react'
import userContext from '@/context/UserContext'
import UserInfo from '@/model/UserInfo'
import { InputArea } from '@/components/Chat/InputArea'

interface PageProps {
	params: {
		id: string
	}
}

function Header ({name}: { name: string }) {
	return <div className='w-full border-b flex flex-row justify-between items-center p-2'>
		<div className='text-xl'>{name}</div>
		<div>Cài đặt</div>
	</div>
}

export default function Page (props: PageProps) {
	const context = useContext(userContext)
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
	useEffect(() => {
		context?.getUser(props.params.id).then(u => {
			if (u != null) {
				setUserInfo(u)
			}
		})
	}, [props.params.id])

	if (userInfo === null) return <h1>Loading...</h1>

	return (
		<div className='flex flex-col h-full'>
			<Header name={userInfo.fullName}/>
			<div className='flex flex-col flex-grow h-[400px]'>
				<div className='flex-grow relative overflow-y-scroll'>
					<div className='overflow-hidden h-max absolute top-0 left-0 w-full'>
						<ChatSessionContent id={props.params.id}/>
					</div>
				</div>
				<div className='p-2 min-h-fit border-t'>
					<InputArea ids={[props.params.id]}/>
				</div>
			</div>
		</div>
	)
}