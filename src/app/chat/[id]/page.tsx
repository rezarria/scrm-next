'use client'

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
				<div>Cai dat</div>
			</div>
			<div className='flex flex-col flex-grow bg-red-700 h-[400px]'>
				<div className='bg-blue-400 flex-grow'>
					<div className='overflow-y-scroll h-max'>
						{
							Array.from(Array(100).keys()).map(t => <div key={t}>Brub</div>)
						}
					</div>
				</div>
				<div className='min-h-fit'>
					<div className='flex flex-row'>
						<textarea className='w-full resize-none focus:outline-0'/>
						<button className='px-3'>SEND</button>
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