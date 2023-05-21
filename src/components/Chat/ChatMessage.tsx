'use client'

import UserInfo from '@/model/UserInfo'
import Image from 'next/image'

interface Props {
	content: string
	left: boolean
	showAvatar?: boolean
	userInfo: UserInfo
}

export default function ChatMessage (props: Props) {
	return (
		<div className={`flex flex-row gap-2 ${props.left ? 'justify-start' : 'flex-row-reverse'}`}>
			{
				!(props.showAvatar !== undefined && !props.showAvatar) &&
                <div className='rounded-full w-8 h-8 bg-black overflow-hidden'>
					{
						props.userInfo.avatar.length != 0 &&
                        <Image className='w-full h-full object-cover' width={50} height={50} src={props.userInfo.avatar}
                               alt='avatar'/>
					}
                </div>
			}
			<div className='rounded bg-white p-2 max-w-[40%] border'>
				<p className='w-full break-words'>{props.content}</p>
			</div>
		</div>
	)
}