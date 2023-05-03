import {ReactNode} from 'react'

interface StatusZoneProps {
	children?: ReactNode
}

export default function StatusZone (props: StatusZoneProps) {
	return <div className='flex flex-row justify-between'>{props.children}</div>
}