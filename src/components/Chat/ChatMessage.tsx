'use client'

interface Props {
	content: string
	left: boolean
	showAvatar?: boolean
}

export default function ChatMessage (props: Props) {
	return (
		<div className={`flex flex-row gap-2 ${props.left ? 'justify-start' : 'flex-row-reverse'}`}>
			{
				!(props.showAvatar !== undefined && !props.showAvatar) &&
				<div className='rounded-full w-8 h-8 bg-black'>

				</div>
			}
			<div className='rounded bg-white p-2 max-w-[40%] border'>
				<p className='w-full break-words'>{props.content}</p>
			</div>
		</div>
	)
}