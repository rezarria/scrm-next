import { createContext, ReactNode, useEffect, useRef } from 'react'
import axios from 'axios'
import Chat from '@/model/Chat'

export interface ChatSessionState {
	getAll: () => Chat[]
	getSession: (id: string) => Promise<Chat | null | undefined>
	update: () => Promise<void>
	subscribe: (callback: Function) => void
	unsubscribe: (callback: Function) => void
}

const ChatSessionContext = createContext<ChatSessionState | null>(null)

export default ChatSessionContext


interface ChatSessionContextProviderProps {
	children: ReactNode
}

export function ChatSessionContextProvider (props: ChatSessionContextProviderProps) {
	const chatSessions = useRef<Chat[]>([])
	const job = useRef<{ task: Promise<Chat | null | undefined> | null }>({task: null})
	const subscribers = useRef<Function[]>([])
	const startTime = useRef(new Date())
	const endTime = useRef(new Date())
	const update = () => {
		return axios.get<Chat[]>('http://localhost:8080/api/user/chat/getSessionByTime', {
			params: {
				start: startTime.current.toISOString(),
				end: endTime.current.toISOString()
			}
		}).then(r => {
			if (r.status === 200) {
				if (r.data.length != 0) {
					let newStartTime = new Date(r.data.reduce((p, c) => p.lastModifiedDate.localeCompare(c.lastModifiedDate) <= 0 ? p : c).lastModifiedDate)
					let newEndTime = new Date(r.data.reduce((p, c) => p.lastModifiedDate.localeCompare(c.lastModifiedDate) >= 0 ? p : c).lastModifiedDate)
					if (newStartTime < startTime.current) startTime.current = newStartTime
					if (newEndTime > endTime.current) endTime.current = newEndTime
					let ids = r.data.map(i => i.id)
					chatSessions.current = r.data.concat(chatSessions.current.filter(i => !ids.includes(i.id))).sort((a, b) => b.lastModifiedDate.localeCompare(a.lastModifiedDate))
					subscribers.current.forEach(t => t())
				}
			}
		})
	}

	const updateTimeout = () => {
		update().then(r => setTimeout(updateTimeout, 5000))
	}

	useEffect(() => {
		updateTimeout()
	}, [])


	let userContextValue: ChatSessionState = {
		getAll: () => chatSessions.current,
		subscribe: callback => {
			subscribers.current.push(callback)
		},
		unsubscribe: callback => {
			const index = subscribers.current.indexOf(callback)
			if (index != -1)
				subscribers.current.splice(index, 1)
		},
		update: update,
		getSession: async id => {
			let session = chatSessions.current.find(x => x.id === id)
			console.log(session)
			if (session != null) return session

			while (true) {
				if (job.current.task !== null) {
					await job.current.task
				}
				session = chatSessions.current.find(x => x.id === id)
				if (session === undefined) break
				return session
			}

			job.current.task = axios.get<Chat>(`http://localhost:8080/api/user/chat/getSession?id=${id}`)
				.then(r => {
					if (r.status === 200) {
						chatSessions.current.push(r.data)
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
		<ChatSessionContext.Provider value={userContextValue}>
			{
				props.children
			}
		</ChatSessionContext.Provider>
	)
}