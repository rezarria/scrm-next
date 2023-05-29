import UploadImage, { UploadImageRef } from '@/components/Chat/UploadImage'
import { useRef } from 'react'

export default function ButtonInputArea () {
	let uploadImage = useRef<UploadImageRef>(null)

	return <>
		<button onClick={() => {
			uploadImage.current?.show()
		}}>Tải ảnh
		</button>
		<UploadImage ref={uploadImage}/>
		<button>Fn2</button>
		<button>Fn3</button>
		<button>Fn3</button>
	</>
}