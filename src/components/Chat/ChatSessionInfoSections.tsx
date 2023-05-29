import { useContext, useEffect, useState } from 'react'
import Chat from '@/model/Chat'
import ChatSessionContext from '@/context/ChatSessionContext'
import { ChatSessionInfoSection } from '@/components/Chat/ChatSessionInfoSection'
import { UsersInChat } from '@/components/Chat/UsersInChat'

export function ChatSessionInfoSections (props: { chatId: string }) {
	const [session, setSession] = useState<Chat | null>(null)
	const chatContext = useContext(ChatSessionContext)

	useEffect(() => {
		chatContext?.getSession(props.chatId).then(chatSession => {
			if (chatSession != null)
				setSession(chatSession)
		})
	}, [props.chatId, chatContext])

	if (session)
		return <div className='flex flex-col gap-2'>
			<ChatSessionInfoSection title='Thành viên'>
				<UsersInChat users={session.users}/>
			</ChatSessionInfoSection>
		</div>
	else
		return <p>loading...</p>
}

