import ChatMessage from '@/components/Chat/ChatMessage'
import { useContext, useEffect, useState } from 'react'
import UserInfo from '@/model/UserInfo'
import userContext from '@/context/UserContext'
import currentUserInfoContext from '@/context/CurrentUserInfoContext'

interface Props {
	id: string
}

export default function ChatSessionContent (props: Props) {
	const [leftUser, setLeftUser] = useState<UserInfo | null>(null)
	const [rightUser, setRightUser] = useState<UserInfo | null>(null)
	const _userContext = useContext(userContext)
	const currentUser = useContext(currentUserInfoContext)
	useEffect(() => {
		_userContext?.getUser(props.id).then(u => {
			if (u != null) setLeftUser(u)
		}).then(() => {
			setRightUser(currentUser?.user!)
		})
	}, [])
	if (leftUser == null || rightUser == null)
		return <p>Loading...</p>
	return (
		<div className='overflow-hidden flex flex-col gap-2 p-2'>
			{
				Array.from(Array(100).keys()).map(t => <ChatMessage userInfo={t % 2 == 0 ? rightUser! : leftUser!}
																	showAvatar={t % 2 == 0} key={t} left={t % 2 == 0}
																	content='brub brub brub brub brub brub brub brub rub brub rub brub rub brub rub brub rub brub rub brub rub brub rub :v'/>)
			}
		</div>
	)
}