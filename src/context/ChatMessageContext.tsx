import {createContext, ReactNode, useEffect, useRef} from 'react'
import axios from 'axios'
import ChatMessage from '@/model/ChatMessage'

export interface ChatMessageState {
	getAll: () => ChatMessage[]
	getMessage: (id: string) => Promise<ChatMessage | null | undefined>
	getTime: () => string
	update: () => Promise<boolean>
	subscribe: (callback: Function) => void
	unsubscribe: (callback: Function) => void
}

const ChatMessageContext = createContext<ChatMessageState | null>(null)

export default ChatMessageContext


interface ChatMessageContextProviderProps {
	id: string
	children: ReactNode
}

export function ChatMessageContextProvider (props: ChatMessageContextProviderProps) {
	const messageSessions = useRef<ChatMessage[]>([])
	const job = useRef<{ task: Promise<ChatMessage | null | undefined> | null }>({task: null})
	const subscribers = useRef<Function[]>([])
	const startTime = useRef(new Date())
	const endTime = useRef(new Date())
	const update = () => {
		return axios.get<ChatMessage[]>('http://localhost:8080/api/user/chat/getMessages', {
			params: {
				id: props.id,
				startTime: startTime.current.toISOString(),
				endTime: endTime.current.toISOString()
			}
		}).then(r => {
			if (r.status === 200) {
				if (r.data.length != 0) {
					let newStartTime = new Date(r.data.reduce((p, c) => p.lastModifiedDate.localeCompare(c.lastModifiedDate) <= 0 ? p : c).lastModifiedDate)
					let newEndTime = new Date(r.data.reduce((p, c) => p.lastModifiedDate.localeCompare(c.lastModifiedDate) >= 0 ? p : c).lastModifiedDate)
					if (newStartTime < startTime.current) startTime.current = newStartTime
					if (newEndTime > endTime.current) endTime.current = newEndTime
					let ids = r.data.map(i => i.id)
					messageSessions.current = r.data.concat(messageSessions.current.filter(i => !ids.includes(i.id))).sort((a, b) => b.lastModifiedDate.localeCompare(a.lastModifiedDate))
					return Promise.resolve(true)
				}
			}
			return Promise.resolve(false)
		})
	}

	const updateTimeout = () => {
		update().then(r => {
			if (r) {
				subscribers.current.forEach(t => {
					console.log(`${t.name} đã thực thi`)
					t()
				})
			}
			setTimeout(updateTimeout, 300)
		})
	}

	useEffect(() => {
		updateTimeout()
	}, [])


	let chatMessageContextValue: ChatMessageState = {
		getTime: () => startTime.current.toString() + endTime.current.toString(),
		getAll: () => messageSessions.current,
		subscribe: callback => {
			subscribers.current.push(callback)
		},
		unsubscribe: callback => {
			const index = subscribers.current.indexOf(callback)
			if (index != -1)
				subscribers.current.splice(index, 1)
		},
		update: update,
		getMessage: async id => {
			let session = messageSessions.current.find(x => x.id === id)
			console.log(session)
			if (session != null) return session

			while (true) {
				if (job.current.task !== null) {
					await job.current.task
				}
				session = messageSessions.current.find(x => x.id === id)
				if (session === undefined) break
				return session
			}

			job.current.task = axios.get<ChatMessage>(`http://localhost:8080/api/user/chat/getSession?id=${id}`)
				.then(r => {
					if (r.status === 200) {
						messageSessions.current.push(r.data)
						return r.data
					}
					return null
				}).finally(() => {
					job.current.task = null
				})

			return await job.current.task
		}
	}
	return (
		<ChatMessageContext.Provider value={chatMessageContextValue}>
			{
				props.children
			}
		</ChatMessageContext.Provider>
	)
}