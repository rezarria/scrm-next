import { ReactNode, useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

export function ChatSessionInfoSection (props: { title: string, children: ReactNode }) {
	const [open, setOpen] = useState(false)

	return (
		<div>
			<div className='flex flex-row justify-between cursor-pointer' onClick={() => {
				setOpen(!open)
			}}>
				<h2 className='select-none'>{props.title}</h2>
				<div className={`${open ? 'rotate-180' : ''}`}>
					<KeyboardArrowDownIcon/>
				</div>
			</div>
			<div className={`${open ? '' : 'hidden'}`}>
				{
					props.children
				}
			</div>
		</div>
	)
}

