import { createContext, ReactNode, useRef, useState } from 'react'
import ChatMessage from '@/model/ChatMessage'
import axios from 'axios'

interface ChatMessageContextValue {
	messages: ChatMessage[]
	update: () => Promise<void>
}

const ChatMessageContext = createContext<ChatMessageContextValue>({
	messages: [], update: () => Promise.resolve()
})

export default ChatMessageContext

export function ChatMessageContextWrapper (props: { children: ReactNode, id: string }) {
	const [messages, setMessages] = useState<ChatMessage[]>([])
	const startTime = useRef<string>(new Date().toISOString())
	const endTime = useRef<string>(startTime.current)

	let value: ChatMessageContextValue = {
		messages: messages,
		update: () => {
			return axios.post<{
				id: string
				startTime: string
				endTime: string
				messages: ChatMessage[]
			}>('http://localhost:8080/api/user/chat/getMessage', {
				id: props.id,
				startTime: startTime.current,
				endTime: endTime.current
			})
				.then(r => {
					if (r.status === 200) {
						let data = r.data
						if (data.messages != null && data.messages.length !== 0) {
							setMessages(data.messages.concat(messages).sort())
						}
					}
				})
		}
	}

	return (
		<ChatMessageContext.Provider value={value}>
			{
				props.children
			}
		</ChatMessageContext.Provider>
	)
}

