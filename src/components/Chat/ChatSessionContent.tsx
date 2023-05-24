import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import UserInfo from '@/model/UserInfo'
import userContext from '@/context/UserContext'
import currentUserInfoContext from '@/context/CurrentUserInfoContext'
import ChatMessageList from '@/components/Chat/ChatMessageList'
import Chat from '@/model/Chat'
import { ChatMessageContextProvider } from '@/context/ChatMessageContext'

interface Props {
	session: Chat
}

export default function ChatSessionContent (props: Props) {
	const [leftUser, setLeftUser] = useState<UserInfo | null>(null)
	const _userContext = useContext(userContext)
	const currentUser = useContext(currentUserInfoContext)
	const uRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (currentUser) {
			_userContext?.getUser(props.session.users.filter(i => i.localeCompare(currentUser.user.id))[0]).then(u => {
				if (u) setLeftUser(u)
			})
		}
	}, [currentUser, _userContext, props.session.users])

	useLayoutEffect(() => {
		if (uRef.current) {
			uRef.current.scrollTo(0, uRef.current.scrollHeight)
		}
	}, [leftUser])

	if (leftUser == null)
		return <p>Loading...</p>
	return (
		<div ref={uRef} className='flex-grow relative overflow-y-scroll'>

			<div className='overflow-hidden h-max absolute top-0 left-0 w-full'>
				<ChatMessageContextProvider id={props.session.id}>
					<div className='overflow-hidden flex flex-col gap-2 p-2'>
						{
							leftUser ?
								<ChatMessageList/> :
								<p>Loading...</p>
						}
					</div>
				</ChatMessageContextProvider>
			</div>
		</div>

	)
}