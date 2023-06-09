import { memo, useContext, useEffect, useRef, useState } from 'react'
import UserInfo from '@/model/UserInfo'
import UserContext from '@/context/UserContext'
import Link from 'next/link'
import Image from 'next/image'
import Chat from '@/model/Chat'
import { AddMoreUser, AddMoreUserRef } from '@/components/Chat/AddMoreUser'

// eslint-disable-next-line react/display-name
const UsersInChat = memo((props: { chat: Chat }) => {
	const [userInfos, setUserInfos] = useState<UserInfo[]>([])
	const userContext = useContext(UserContext)
	const addMoreUser = useRef<AddMoreUserRef>(null)


	useEffect(() => {
		if (userContext) {
			userContext.getUsers(props.chat.users).then(d => {
				if (d != null) {
					setUserInfos(d)
				}
			})
		}
	}, [userContext, props.chat.users])

	return (
		<div className='flex flex-col gap-0 my-1'>
			<div className='flex flex-col gap-2 py-2 px-1 rounded bg-blue-500'>
				{
					userInfos.map(u => <div key={u.id} className='flex flex-col gap-6'>
						<div className='hover:bg-white hover:outline rounded'>
							<Link href={`/user/${u.id}`}>
								<div className='flex flex-row gap-2 items-center'>
									<div className='rounded-full h-12 w-12 overflow-hidden bg-black'>
										{
											u.avatar && u.avatar.length != 0 &&
                                            <Image src={u.avatar} width={300} height={300} alt='avatar'
                                                   className='h-full w-full object-cover'/>
										}
									</div>
									<div>{u.fullName}</div>
								</div>
							</Link>
						</div>
					</div>)
				}
			</div>
			<div
				onClick={() => {
					if (addMoreUser.current) {
						addMoreUser.current.show()
					}
				}}
				className='text-center text-blue-500 p-2 bg-white cursor-pointer hover:bg-blue-400 hover:text-white hover:font-bold rounded-b'>Thêm
				người dùng
			</div>
			<AddMoreUser ref={addMoreUser} chat={props.chat}/>
		</div>
	)
})

export default UsersInChat