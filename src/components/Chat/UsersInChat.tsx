import { useContext, useEffect, useState } from 'react'
import UserInfo from '@/model/UserInfo'
import UserContext from '@/context/UserContext'

export function UsersInChat (props: { users: string[] }) {
	const [userInfos, setUserInfos] = useState<UserInfo[]>([])
	const userContext = useContext(UserContext)

	useEffect(() => {
		if (userContext) {
			userContext.getUsers(props.users).then(d => {
				setUserInfos(d)
			})
		}
	}, [userContext, props.users])

	return (
		<div>
			{
				userInfos.map(u => <div key={u.id}>
					{u.id}
				</div>)
			}
		</div>
	)
}