import { useRef } from 'react'
import InfoIcon from '@mui/icons-material/Info'
import { ChatSessionInfo, ChatSessionInfoRef } from '@/components/Chat/ChatSessionInfo'

export function ChatSessionInfoButton (props: { chatId: string }) {
	let info = useRef<ChatSessionInfoRef>(null)

	return <>
		<div className='cursor-pointer' onClick={() => {
			if (info.current != null) {
				info.current.show()
			}
		}}><InfoIcon/></div>
		<ChatSessionInfo chatId={props.chatId} ref={info}/>
	</>
}

