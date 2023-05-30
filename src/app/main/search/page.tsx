'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import UserInfo, { FriendStatus } from '@/model/UserInfo'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'

export default function Page () {
	const router = useRouter()
	const search = useSearchParams()
	const content = search.get('s')
	const [users, setUsers] = useState<UserInfo[]>([])
	useEffect(() => {
		if (content)
			userSeach(content).then(d => setUsers(d))
	}, [content])

	const goToPage = (id: string) => {
		return () => {
			router.push(`/user/${id}`)
		}
	}

	return (
		<div className='min-h-screen bg-white block p-6'>
			<div className='flex flex-col gap-4'>
				{
					users.map(user => <div key={user.id} className='flex flex-row gap-4 items-center'>
						<div className={'h-24 w-24 rounded-full overflow-hidden bg-black cursor-pointer'}
							 onClick={goToPage(user.id)}>
							{
								user.avatar && user.avatar.length != 0 &&
                                <Image className={'w-full h-full object-cover'} src={user.avatar} width={400}
                                       height={400} alt={'avatar'}/>
							}
						</div>
						<div className={'flex-1'}>
							<div className={'flex flex-row gap-4 items-baseline justify-between'}>
								<div><span className={'text-3xl cursor-pointer'}
										   onClick={goToPage(user.id)}>{user.fullName}</span></div>
								<FriendButton id={user.id} status={FriendStatus[user.friendStatus]}/>
							</div>
							<div className={'flex flex-row gap-4'}>
								<div>@{user.id}</div>
								<div>Bạn bè: {user.friends.length}</div>
							</div>
						</div>
					</div>)
				}
			</div>
		</div>
	)
}

function FriendButton (props: { id: string, status: FriendStatus }) {
	switch (props.status) {
		case FriendStatus.FRIEND:
			return (
				<button className={'flex flex-row gap-2 rounded p-2 bg-red-500 font-bold text-white'}>
					<PersonRemoveIcon/>xoá bạn</button>
			)
		case FriendStatus.NON_FRIEND:
			return (
				<button className={'flex flex-row gap-2 rounded p-2 bg-blue-500 font-bold text-white'}><PersonAddIcon/>kết
					bạn</button>
			)
		default:
			return <></>
	}
}


function userSeach (content: string) {
	return axios.get<UserInfo[]>('http://localhost:8080/api/user/find', {
		params: {
			s: content
		}
	}).then(r => {
		if (r.status !== 200) return []
		return r.data
	}).catch(r => {
		let arr: UserInfo[] = []
		return arr
	})
}