import { memo, useContext, useEffect, useState } from 'react'
import UserInfo from '@/model/UserInfo'
import UserContext from '@/context/UserContext'

// eslint-disable-next-line react/display-name
const UsersInChat = memo((props: { users: string[] }) => {
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
})

export default UsersInChat