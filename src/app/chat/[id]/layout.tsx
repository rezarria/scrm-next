import {ReactNode} from 'react'

interface Props {
	params: {
		id: string
	}
	children: ReactNode
}

export default function Layout (props: Props) {
	return <>
		{
			props.children
		}
	</>
}