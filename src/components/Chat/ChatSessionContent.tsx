import {useContext, useEffect, useLayoutEffect, useRef, useState} from 'react'
import UserInfo from '@/model/UserInfo'
import userContext from '@/context/UserContext'
import currentUserInfoContext from '@/context/CurrentUserInfoContext'
import ChatMessageList from '@/components/Chat/ChatMessageList'
import Chat from '@/model/Chat'
import {ChatMessageContextProvider} from '@/context/ChatMessageContext'

interface Props {
	session: Chat
}

export default function ChatSessionContent (props: Props) {
	const [leftUser, setLeftUser] = useState<UserInfo | null>(null)
	const _userContext = useContext(userContext)
	const currentUser = useContext(currentUserInfoContext)
	useEffect(() => {
		if (currentUser) {
			_userContext?.getUser(props.session.users.filter(i => i.localeCompare(currentUser.user.id))[0]).then(u => {
				if (u) setLeftUser(u)
			})
		}
	}, [currentUser, _userContext, props.session.users])

	if (leftUser == null)
		return <p>Loading...</p>
	return (
		<ChatMessageContextProvider id={props.session.id}>
						{
							leftUser ?
								<ChatMessageList/> :
								<p>Loading...</p>
						}
		</ChatMessageContextProvider>

	)
}