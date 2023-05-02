import {memo, useContext, useEffect, useState} from 'react'
import UserContext from '@/context/UserContext'
import UserInfo from './UserInfo'
import {default as UserInfoModel} from '@/model/UserInfo'

function UserInfoById (props: { id: string }) {
	const context = useContext(UserContext)
	if (context === null) throw 'context rỗng'
	const [user, setUser] = useState<UserInfoModel | null | undefined>(context.users.find(x => x.id === props.id))

	useEffect(() => {
		if (user == null) context.getUser(props.id).then(u => setUser(u))
	}, [])

	return user ?
		<UserInfo avatar={user.avatar} name={user.fullName}/>
		:
		<div>
			NOT FOUND
		</div>
}

export default memo(UserInfoById)