interface Props {
	id: string
}

export function InputArea (props: Props) {
	return <>
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
	</>
}