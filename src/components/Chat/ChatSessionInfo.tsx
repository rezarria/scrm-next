import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { ChatSessionInfoSections } from '@/components/Chat/ChatSessionInfoSections'

export interface ChatSessionInfoRef {
	show: () => void
	hide: () => void
}

interface ChatSessionInfoProps {
	chatId: string
}

// eslint-disable-next-line react/display-name
export const ChatSessionInfo = forwardRef<ChatSessionInfoRef, ChatSessionInfoProps>((props, ref) => {
	let overlay = useRef<HTMLDivElement>(null)
	const [modal, setModal] = useState(false)
	useImperativeHandle(ref, () => ({
		show: () => {
			setModal(true)
		},
		hide: () => {
			setModal(false)
		}
	}))

	return (
		<div className={`z-[10] top-0 left-0 absolute w-screen h-screen ${modal ? '' : 'hidden'}`}>
			<div ref={overlay} className='cursor-pointer z-[1] w-screen h-screen bg-amber-50/50' onClick={() => {
				setModal(false)
			}}></div>
			<div className='absolute h-screen min-w-[100px] z-[2] top-0 right-0 border bg-blue-400'>
				<ChatSessionInfoSections chatId={props.chatId}/>
			</div>
		</div>
	)
})

