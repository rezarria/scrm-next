import {ChangeEventHandler, forwardRef, useImperativeHandle, useRef} from 'react'
import axios from 'axios'

interface UploadImageProps {
	callback : () => void
}

export interface UploadImageRef {
	show: () => void
}

// eslint-disable-next-line react/display-name
const UploadImage = forwardRef<UploadImageRef, UploadImageProps>((props, ref) => {
	let div = useRef<HTMLDivElement>(null)
	let file = useRef<HTMLInputElement>(null)


	useImperativeHandle(ref, (): UploadImageRef => ({
		show: () => {
			if (div.current) {
				div.current.classList.add('block')
			}

			if (file.current) {
				file.current.click()
			}
		}
	}), [])

	const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		let f = e.target
		if (f.files) {
			let formData = new FormData()
			for (let i = 0; i < f.files.length; i++) {
				formData.append('files', f.files[i])
			}
			axios.post('http://localhost:8080/api/user/picture/upload', formData).then(
				r => {
					if (r.status === 200) {

					}
				}
			)
		}
	}

	return <>
		<div ref={div} className='hidden'>
			<input ref={file} type='file' onChange={onChange}/>
		</div>
	</>
})

export default UploadImage