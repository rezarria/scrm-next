import { ChatSessionInfoButton } from '@/components/Chat/ChatSessionInfoButton'

export function Header ({name, chatId}: { name: string, chatId: string }) {
	return <div className='w-full border-b flex flex-row justify-between items-center p-2'>
		<div className='text-xl'>{name}</div>
		<ChatSessionInfoButton chatId={chatId}/>
	</div>
}

