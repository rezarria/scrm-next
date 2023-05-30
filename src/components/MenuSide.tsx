import Image from 'next/image'
import { ReactNode } from 'react'

export interface MenuSideProps {
	items?: { icon?: string | null, iconElement?: ReactNode, title?: string | null, onClick?: Function }[];
}

export default function MenuSide (props: MenuSideProps) {
	return <ul className='bg-white rounded-r min-w-[200px] w-fit h-full p-3'>
		{props.items && props.items.map((n, i) => <li key={i}>
			<div
				className='rounded cursor-pointer p-2 duration-500 flex flex-row gap-3 hover:bg-blue-300 hover:duration-75 items-center'
				onClick={() => {
					if (n.onClick !== undefined) n.onClick()
				}}>
				<div className='rounded-full w-10 h-10 bg-neutral-400 overflow-hidden'>
					{!n.iconElement && n.icon && <Image src={n.icon} width='500' height='500' alt='icon'
                                      className='w-full h-full object-cover object-top'/>}
					{
						n.iconElement
					}
				</div>
				{n.title && <p>{n.title}</p>}
			</div>
		</li>)}
	</ul>
}