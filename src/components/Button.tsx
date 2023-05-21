import { MouseEventHandler } from 'react'

interface ButtonProps {
	title: string,
	className?: string,
	onClick?: MouseEventHandler<HTMLButtonElement>
}

export default function Button (props: ButtonProps) {
	return <button className={`${props.className} rounded bg-blue-500 p-1.5 text-white font-medium text-[0.8rem]`}
				   onClick={props.onClick}>{props.title}</button>
}