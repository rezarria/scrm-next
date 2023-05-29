import { createContext, ReactNode, useEffect, useMemo, useRef } from 'react'
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
	const chatSessions = useRef<Map<string, Chat>>(new Map())
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
					r.data.forEach(item => {
						chatSessions.current.set(item.id, item)
					})
					subscribers.current.forEach(t => t())
				}
			}
		})
	}


	useEffect(() => {
		let timeout: NodeJS.Timeout
		const updateTimeout = () => {
			update().then(r => {
				timeout = setTimeout(updateTimeout, 5000)
			})
		}

		updateTimeout()

		return () => {
			clearTimeout(timeout)
		}
	}, [])


	let userContextValue: ChatSessionState = useMemo(() => {
		return {
			getAll: () => Array.from(chatSessions.current.values()),
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
				let session = chatSessions.current.get(id)
				console.log(session)
				if (session != null) return session

				while (true) {
					if (job.current.task !== null) {
						await job.current.task
					}
					session = chatSessions.current.get(id)
					if (session === undefined) break
					return session
				}

				job.current.task = axios.get<Chat>(`http://localhost:8080/api/user/chat/getSession?id=${id}`)
					.then(r => {
						if (r.status === 200) {
							chatSessions.current.set(r.data.id, r.data)
							return r.data
						}
						return null
					}).finally(() => {
						job.current.task = null
					})

				return await job.current.task
			}
		}
	}, [])
	return (
		<ChatSessionContext.Provider value={userContextValue}>
			{
				props.children
			}
		</ChatSessionContext.Provider>
	)
}