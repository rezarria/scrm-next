'use client'

import ChatSessionContent from '@/components/Chat/ChatSessionContent'

interface PageProps {
	params: {
		id: string
	}
}

export default function Page (props: PageProps) {
	return (
		<div className='flex flex-col h-full'>
			<div className='w-full border-b flex flex-row justify-between items-center p-2'>
				<div className='text-xl'>Võ Tá Nam</div>
				<div>Cài đặt</div>
			</div>
			<div className='flex flex-col flex-grow h-[400px]'>
				<div className='flex-grow relative overflow-y-scroll'>
					<div className='overflow-hidden h-max absolute top-0 left-0 w-full'>
						<ChatSessionContent/>
					</div>
				</div>
				<div className='p-2 min-h-fit border-t'>
					<div className='flex flex-row'>
						<div className='flex-grow'>
							<textarea
								className='block w-full h-fit resize-none focus:outline-0 rounded border p-2 min-h-[2em]'
								onInput={event => {
									event.currentTarget.style.height = '2em'
									event.currentTarget.style.height = event.currentTarget.scrollHeight + event.currentTarget.offsetHeight + 'px'
								}}/>
						</div>
						<button className='px-3 rounded border hover:bg-blue-200 duration-500'>SEND</button>
					</div>
					<div className='flex flex-row gap-2'>
						<button>Fn1</button>
						<button>Fn2</button>
						<button>Fn3</button>
						<button>Fn3</button>
					</div>
				</div>
			</div>
		</div>
	)
}