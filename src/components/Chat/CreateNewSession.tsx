'use client'

import {useContext, useEffect, useRef, useState} from 'react'
import UserInfoContext from '@/context/userInfoContext'
import {getFriends} from '@/utils/function'
import FriendInfo from '@/model/FriendInfo'
import Image from 'next/image'

interface Props {
	userId?: string
}

export default function CreateNewSession (props: Props) {
	const [friends, setFriends] = useState<FriendInfo[]>([])
	let userInfo = useContext(UserInfoContext)
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
						{
							friends.map(k => (
								<div key={k.id} className='flex flex-row gap-2 rounded bg-white p-2 cursor-pointer'>
									<div className='rounded-full w-10 h-10 overflow-hidden bg-black'>
										{k.avatar !== null && <Image src={k.avatar} alt='' width={200} height={200}/>}
									</div>
									<div>
										{k.fullName}
									</div>
								</div>)
							)
						}
					</div>
				</div>
			</div>
		</>
		}
	</>
}