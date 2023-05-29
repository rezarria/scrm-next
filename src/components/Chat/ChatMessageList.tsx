import { useContext, useEffect, useRef, useState } from 'react'
import ChatMessageContext from '@/context/ChatMessageContext'
import ChatMessage from '@/components/Chat/ChatMessage'
import CurrentUserInfoContext from '@/context/CurrentUserInfoContext'

export default function ChatMessageList () {
	let messageContext = useContext(ChatMessageContext)
	let currentUser = useContext(CurrentUserInfoContext)
	const [force, setForce] = useState(Date.now)
	const uRef = useRef<HTMLDivElement>(null)
	const diemCuoi = useRef<HTMLDivElement>(null)

	const update = () => {
		setForce(Date.now)
	}

	useEffect(() => {
		if (messageContext) {
			console.log('đã đăng ký')
			messageContext.subscribe(update)
		}

		setTimeout(() => {
			if (diemCuoi.current) {
				diemCuoi.current.scrollIntoView({behavior: 'smooth'})
			}
		}, 100)

		return () => {
			console.log('hủy đăng ký')
			messageContext?.unsubscribe(update)
		}

	}, [])
	useEffect(() => {
		setTimeout(() => {
			if (diemCuoi.current) {
				diemCuoi.current.scrollIntoView({behavior: 'smooth'})
			}
		}, 100)
	}, [messageContext?.getTime()])


	console.log('render lại danh sách tin ngắn')
	if (currentUser?.user == null) return <p>dang nhap tin nhan ...</p>


	return <>
		<div ref={uRef} className='flex-grow relative overflow-y-scroll'>
			<div className='overflow-hidden h-max absolute top-0 left-0 w-full'>
				<div className='overflow-hidden flex flex-col gap-2 p-2'>
					{
						messageContext!
							.getAll()
							.map(m => {
								let left = m.createBy.localeCompare(currentUser!.user!.id) !== 0
								return <ChatMessage key={m.id}
													message={m}
													left={left}
													showAvatar={left}
								/>
							})
							.reverse()
					}
					<div ref={diemCuoi}></div>
				</div>
			</div>
		</div>
	</>
}