import { useContext, useEffect } from 'react'
import ChatMessageContext from '@/context/ChatMessageContext'
import ChatMessage from '@/components/Chat/ChatMessage'
import CurrentUserInfoContext from '@/context/CurrentUserInfoContext'

export default function ChatMessageList () {
	let messageContext = useContext(ChatMessageContext)
	let currentUser = useContext(CurrentUserInfoContext)
	useEffect(() => {
		let job = () => {
			messageContext.update().then(() => {
					setTimeout(job, 5000)
				}
			)
		}
		job()
	}, [])


	if (currentUser?.user == null) return <p>dang nhap tin nhan ...</p>

	return <>
		{
			messageContext
				.messages
				.map(m => <ChatMessage key={m.id} content={m.content}
									   left={m.id.localeCompare(currentUser!.user!.id) !== 0} userId={m.createBy}/>)
		}
	</>
}