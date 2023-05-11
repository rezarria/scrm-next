'use client'

import {useEffect, useState} from 'react'
import axios from 'axios'
import Image from 'next/image'
import NutHuyKetBan from '@/components/FriendList/NutHuyKetBan'

interface Props {
	id: string
}

interface FriendInfo {
	fullName: string
	avatar: string
	id: string
}

export default function FriendList (props: Props) {
	const [friendInfo, setFriendInfo] = useState<FriendInfo[]>([])
	useEffect(() => {
		axios.get<FriendInfo[]>(`http://localhost:8080/api/user/friend/list?id=${props.id}`)
			.then(r => {
				if (r.status === 200) {
					setFriendInfo(r.data)
				}
			})
	}, [props.id])
	return (
		<div className='bg-white pt-8 px-14'>
			<div className='px-2'>
				<h2 className='text-4xl text-center'>Bạn bè</h2>
				<hr/>
			</div>
			<div className='flex flex-col gap-2 mt-4'>
				{
					friendInfo.map(u => (
						<div key={u.id}
							 className='group flex flex-row gap-4 hover:rounded hover:bg-blue-500 p-2 duration-300 hover:duration-200'>
							<div className='rounded-full bg-black w-16 h-16 overflow-hidden cursor-pointer'>
								{
									u.avatar && <Image src={u.avatar} width='100' height='100' alt='avatar'/>
								}
							</div>
							<div className='flex flex-col'>
								<div className='text-2xl group-hover:text-white cursor-pointer'>{u.fullName}</div>
								<div
									className='text-neutral-500 text-xs cursor-pointer group-hover:text-black'>@{u.id}</div>
							</div>
							<div className='group flex flex-row-reverse flex-grow items-center'>
								<NutHuyKetBan/>
							</div>
						</div>
					))
				}
			</div>

		</div>
	)
}