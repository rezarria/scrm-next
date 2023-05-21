import Chat from '@/model/Chat'
import { createContext } from 'react'

const ChatContext = createContext<{
	chats: Chat[]
	update: () => void
} | null>(null)

export default ChatContext