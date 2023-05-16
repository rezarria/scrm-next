import ChatMessage from '@/components/Chat/ChatMessage'

export default function ChatSessionContent () {
	return (
		<div className='overflow-hidden flex flex-col gap-2 p-2'>
			{
				Array.from(Array(100).keys()).map(t => <ChatMessage showAvatar={t % 2 == 0} key={t} left={t % 2 == 0}
																	content='brub brub brub brub brub brub brub brub rub brub rub brub rub brub rub brub rub brub rub brub rub brub rub :v'/>)
			}
		</div>
	)
}