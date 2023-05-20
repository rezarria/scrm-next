'use client'

import {useContext, useEffect, useRef, useState} from 'react'
import CurrentUserInfoContext from '@/context/CurrentUserInfoContext'
import {getFriends} from '@/utils/function'
import FriendInfo from '@/model/FriendInfo'
import Image from 'next/image'
import axios from 'axios'

interface Props {
	userId?: string
}

export default function CreateNewSession (props: Props) {
	const [friends, setFriends] = useState<FriendInfo[]>([])
	let userInfo = useContext(CurrentUserInfoContext)
	let modal = useRef<HTMLDivElement>(null)

	useEffect(() => {
		getFriends().then(data => {
			setFriends(data)
		})
	}, [])

	return <>
		{userInfo && <>
			<div className='group m-2 text-center border rounded cursor-pointer hover:bg-blue-400 duration-300'
				 onClick={event => {
					 modal.current?.classList.toggle('hidden')
				 }}>
				<span className='group-hover:text-white duration-100 text-xl'>+</span>
			</div>
			<div ref={modal} className='fixed h-screen w-screen z-10 flex justify-center items-center hidden'>
				<div className='absolute w-screen h-screen bg-white/50 top-0 left-0 -z-10' onClick={event => {
					modal.current?.classList.add('hidden')
				}}></div>
				<div className='bg-blue-400 p-2 rounded flex flex-col gap-2'>
					<div className='rounded border'><input type='text' className='focus:outline-0 p-1'
														   placeholder='tên người dùng'/></div>
					<div className='flex flex-col gap-2'>
						{friends.map(k => <FriendItem key={k.id} data={k}/>)}
					</div>
				</div>
			</div>
		</>
		}
	</>
}

function FriendItem ({data, onClick}: { data: FriendInfo, onClick?: Function }) {
	let userInfo = useContext(CurrentUserInfoContext)
	return (
		<div key={data.id} className='flex flex-row gap-2 rounded bg-white p-2 cursor-pointer' onClick={event => {
			axios.post('http://localhost:8080/api/user/chat/createSession', {
				users: [data.id, userInfo!.user.id]
			}).then(value => {
				if (onClick !== undefined) onClick()
			})
		}}>
			<div className='rounded-full w-10 h-10 overflow-hidden bg-black'>
				{data.avatar !== null && <Image src={data.avatar} alt='' width={200} height={200}/>}
			</div>
			<div>
				{data.fullName}
			</div>
		</div>
	)
}