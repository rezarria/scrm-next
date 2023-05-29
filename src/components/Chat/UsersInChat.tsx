import { memo, useContext, useEffect, useState } from 'react'
import UserInfo from '@/model/UserInfo'
import UserContext from '@/context/UserContext'
import Link from 'next/link'
import Image from 'next/image'

// eslint-disable-next-line react/display-name
const UsersInChat = memo((props: { users: string[] }) => {
	const [userInfos, setUserInfos] = useState<UserInfo[]>([])
	const userContext = useContext(UserContext)

	useEffect(() => {
		if (userContext) {
			userContext.getUsers(props.users).then(d => {
				if (d != null) {
					setUserInfos(d)
				}
			})
		}
	}, [userContext, props.users])

	return (
		<div className='flex flex-col gap-2 my-1'>
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
	)
})

export default UsersInChat