import { ReactNode } from 'react'
import Image from 'next/image'

interface Props {
	icon?: string | ReactNode
	count?: number
}

export default function StatusInfo (props: Props) {
	let icon: ReactNode = null
	if (props.icon) {
		if (typeof props.icon === 'string')
			icon = <Image src={props.icon} alt='icon' width='64' height='64'/>
		else
			icon = props.icon
	}

	return <div
		className='group rounded flex flex-row gap-1 items-center justify-between cursor-pointer hover:bg-white p-1 first:-ms-1 last:-me-1 duration-100 hover:duration-100'>
		<div>{icon}</div>
		<div>{props.count}</div>
	</div>
}