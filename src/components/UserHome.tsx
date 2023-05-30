import UserInfo from '@/model/UserInfo'
import Image from 'next/image'
import Button from '@/components/Button'
import axios from 'axios'
import { Status } from '@/model/FriendRequest'
import { useState } from 'react'

interface UserHomeProps {
	userInfo: UserInfo,
	addFriendButton?: boolean
}

function FriendButton (props: UserHomeProps) {
	const [show, setShow] = useState(true)
	if (!show) return <></>
	if (props.userInfo.friendStatus === 'INVITING')
		return <div className={'rounded p-2 my-1 bg-yellow-400 w-full'}>
			<h3 className={'text-center'}>Lời mời kết bạn</h3>
			<div className={'flex flex-row w-full'}>
				<button
					onClick={resolveRequest(props.userInfo.id, Status.YES, () => setShow(false))}
					className={'flex-1 rounded rounded-r-0 p-2 text-black hover:bg-green-400 hover:text-gray-100'}>đồng
					ý
				</button>
				<button
					onClick={resolveRequest(props.userInfo.id, Status.NO, () => setShow(false))}
					className={'flex-1 rounded rounded-l-0 p-2 text-black hover:bg-red-700 hover:text-white'}>từ
					chối
				</button>
			</div>
		</div>
	return <Button title='KẾT BẠN' onClick={() => {
		axios.post('http://localhost:8080/api/user/friend/request', {
			userId: props.userInfo.id
		})
	}}/>
}

function resolveRequest (id: string, status: Status, callback?: Function) {
	return () => {
		axios.post('http://localhost:8080/api/user/friend/responseRequestByUserId', {id, status})
			.then(r => {
				if (r.status === 200) {
					callback?.()
				}
			})
	}
}

export default function UserHome (props: UserHomeProps) {
	return <div>
		<div className='bg-neutral-300'>
			<div className='h-[300px] bg-amber-200'>
				{props.userInfo.background &&
                    <Image src={props.userInfo.background} width='2000' height='2000' alt='background'
                           className='h-full object-cover object-top'/>}
			</div>
			<div className='flex flex-row items-stretch gap-5 -top-10 relative px-14'>
				<div
					className='rounded-full bg-black w-56 h-56 overflow-hidden border-2 border-opacity-40 border-blue-400'>
					{props.userInfo.avatar && <Image src={props.userInfo.avatar} width='300' height='300' alt='avatar'
                                                     className='w-full h-full object-cover object-top'/>}
				</div>
				<div className='flex flex-col justify-end'>
					<div className='text-4xl'>{props.userInfo.fullName}</div>
					<div className='min-h-[40%] flex flex-row items-start'>
						{props.addFriendButton === true && FriendButton(props)}
					</div>
				</div>
			</div>
		</div>
	</div>
}