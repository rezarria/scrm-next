import {memo, ReactNode} from 'react'
import Image from 'next/image'

interface UserInfoProps {
	name?: string | null
	avatar?: string | null
	underName?: ReactNode
}

function UserInfo (props: UserInfoProps) {
	return <div className='flex flex-row items-start gap-2'>
		<div className='rounded-full bg-black w-16 h-16 overflow-hidden'>
			{props.avatar &&
				<Image src={props.avatar} width='200' height='200' alt='avatar' className='object-contain object-top'/>}
		</div>
		<div className='flex flex-col'>
			<div>{props.name}</div>
			<div>{props.underName}</div>
		</div>
	</div>
}

export default memo(UserInfo)
