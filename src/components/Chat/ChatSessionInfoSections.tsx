import { useContext, useEffect, useRef, useState } from 'react'
import Chat from '@/model/Chat'
import ChatSessionContext from '@/context/ChatSessionContext'
import { ChatSessionInfoSection } from '@/components/Chat/ChatSessionInfoSection'
import UsersInChat from '@/components/Chat/UsersInChat'
import CloseIcon from '@mui/icons-material/Close'
import axios from 'axios'

function DeleteChatSession (props: { id: string }) {
	const context = useContext(ChatSessionContext)
	const modal = useRef<HTMLDivElement>(null)
	return <>
		<div className='bg-red-500 p-2 rounded text-white cursor-pointer font-bold' onClick={() => {
			if (modal.current) {
				modal.current.classList.remove('hidden')
			}
		}}>
			Xóa
		</div>
		<div ref={modal} className='fixed z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
			<div
				onClick={() => {
					if (modal.current) {
						modal.current.classList.add('hidden')
					}
				}}
				className={'absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 rounded-full bg-white border-4 cursor-pointer w-12 h-12 flex justify-center items-center'}>
				<CloseIcon/></div>
			<div className='bg-red-500 rounded p-4 flex flex-col gap-4'>
				<h2 className='font-bold text-white text-2xl'>Xóa cuộc trò chuyện này?</h2>
				<div className='flex flex-row gap-0 justify-between'>
					<button
						onClick={() => {
							axios.delete('http://localhost:8080/api/user/chat/deleteSession', {
								params: {
									id: props.id
								}
							}).then(r => {
								if (r.status === 200 && context) context.delete(props.id)
							})
						}}
						className={'font-bold flex-1 rounded-l border border-r-0 bg-white hover:bg-red-600 text-red-600 hover:text-white'}>Xóa!
					</button>
					<button
						onClick={() => {
							if (modal.current) {
								modal.current.classList.add('hidden')
							}
						}}
						className={'font-bold flex-1 rounded-r border border-l-0 hover:bg-blue-600 bg-white text-blue-600 hover:text-white'}>Hủy
					</button>
				</div>
			</div>
		</div>
	</>
}

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
		return <div className='flex flex-col gap-2 p-2'>
			<ChatSessionInfoSection title='Thành viên'>
				<UsersInChat chat={session}/>
			</ChatSessionInfoSection>
			<DeleteChatSession id={props.chatId}/>
		</div>
	else
		return <p>loading...</p>
}

