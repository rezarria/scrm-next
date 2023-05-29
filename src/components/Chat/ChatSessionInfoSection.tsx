import { ReactNode, useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

export function ChatSessionInfoSection (props: { title: string, children: ReactNode }) {
	const [open, setOpen] = useState(false)

	return (
		<div className='bg-white rounded'>
			<div className='flex flex-row justify-between cursor-pointer hover:bg-white rounded p-1' onClick={() => {
				setOpen(!open)
			}}>
				<h2 className='select-none'>{props.title}</h2>
				<div className={`${open ? 'rotate-180' : ''}`}>
					<KeyboardArrowDownIcon/>
				</div>
			</div>
			<div className={`${open ? 'bg-blue-400 my-2 mx-1 rounded' : 'hidden'}`}>
				{
					props.children
				}
			</div>
		</div>
	)
}

