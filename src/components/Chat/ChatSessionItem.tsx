'use client'

interface Props {
	onClick?: Function
}

export default function ChatSessionItem () {
	return <div className='flex flex-row gap-2 p-2 cursor-pointer rounded-r hover:bg-blue-400'>
		<div className='rounded-full w-12 h-12 bg-black'></div>
		<div className='flex-col'>
			<div className='font-semibold'>Võ Tá Nam</div>
			<div className='text-sm'>Võ Tá Nam</div>
		</div>
	</div>
}