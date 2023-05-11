import UserInfo from '@/model/UserInfo'
import Image from 'next/image'
import Button from '@/components/Button'
import axios from 'axios'

interface UserHomeProps {
	userInfo: UserInfo,
	addFriendButton?: boolean
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
						{props.addFriendButton && <Button title='KẾT BẠN' onClick={() => {
							axios.post('http://localhost:8080/api/user/friend/request', {
								userId: props.userInfo.id, mode: 2
							})
						}}/>}
					</div>
				</div>
			</div>
		</div>
	</div>
}