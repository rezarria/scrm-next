import {ReactNode, useContext, useEffect, useState} from 'react'
import UserContext from '@/context/UserContext'
import UserInfo from './UserInfo'
import {default as UserInfoModel} from '@/model/UserInfo'

function UserInfoById (props: { id: string, underName?: ReactNode }) {
	const context = useContext(UserContext)
	if (context === null) throw 'context rỗng'
	const [user, setUser] = useState<UserInfoModel | null | undefined>(null)

	useEffect(() => {
		if (user === null) {
			console.log('không có thông tin user, truy vấn...')
			context.getUser(props.id).then(u => setUser(u))
		}
	}, [])

	return user ?
		<UserInfo avatar={user.avatar} name={user.fullName} underName={props.underName}/>
		:
		<div>
			NOT FOUND
		</div>
}

export default UserInfoById