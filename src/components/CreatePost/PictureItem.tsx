import CloseIcon from '@mui/icons-material/Close';
import {useEffect, useRef} from 'react';

interface Props {
	src?: string
	onClose?: Function
}

export default function PictureItem (props: Props) {
	const image = useRef<HTMLImageElement>(null)
	const obj = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (props.src !== undefined && image.current !== null) image.current.src = props.src
	}, [props.src])

	return (
		<div ref={obj} className='group w-20 h-20 border rounded relative'>
			<div onClick={() => {
				if (props.onClose !== undefined) props.onClose()
			}} className='absolute cursor-pointer -right-3 -top-3 bg-red-300 rounded-full w-6 h-6 leading-none hidden group-hover:block z-50'>
				<CloseIcon/></div>
			<img ref={image} className='w-full h-full object-contain' alt='image'/>
		</div>
	)
}