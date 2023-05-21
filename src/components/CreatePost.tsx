'use client'

import { useEffect, useRef, useState } from 'react'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import axios from 'axios'
import { default as PictureSection, PictureSectionRef } from '@/components/CreatePost/PictureSection'

export default function CreatePost () {
	const nutH = useRef<HTMLDivElement>(null)
	const modal = useRef<HTMLDivElement>(null)
	const nutHuy = useRef<HTMLButtonElement>(null)
	const overlay = useRef<HTMLDivElement>(null)
	const [content, setContent] = useState<string>('')
	const pictures = useRef<PictureSectionRef>(null)

	useEffect(() => {
		if (nutHuy.current === null) throw ''
		nutHuy.current.onclick = ev => {
			if (modal.current === null) throw ''
			modal.current.classList.add('hidden')
		}
		if (nutH.current === null) throw ''
		nutH.current.onclick = ev => {
			if (modal.current === null) throw ''
			modal.current.classList.remove('hidden')
		}
		if (overlay.current === null) throw ''
		overlay.current.onclick = ev => {
			if (modal.current === null) throw ''
			modal.current.classList.add('hidden')
		}
	}, [])

	function gui () {
		if (content.length != 0) {
			axios.post('http://localhost:8080/api/user/post').then(r => {
			})
		}
	}

	return <div className='bg-white mb-1'>
		<div className='px-16 py-5 w-full'>
			<div ref={nutH} className='rounded w-full h-12 border cursor-pointer'>
				<span></span>
			</div>
		</div>
		<div ref={modal} className='hidden z-50 fixed w-full h-full top-0 left-0'>
			<div ref={overlay} className='z-10 bg-neutral-700/80 absolute w-full h-full cursor-pointer'></div>
			<div className='z-20 w-[800px] mx-auto top-12 relative bg-white p-5 rounded'>
				<h1></h1>
				<textarea onChange={event => setContent(event.target.value)}
						  className='rounded w-full min-h-[200px] hover:outline-blue-600 outline-0 p-2 resize-none'/>
				<PictureSection ref={pictures}/>
				<div className='mt-2 border-t-2 flex flex-col gap-1'>
					<div className='flex flex-row gap-2 justify-between'>
						<button className=''><AddPhotoAlternateIcon className='text-cyan-500'/></button>
					</div>
					<div className='flex flex-row gap-2 justify-end'>
						<button onClick={gui}
								className='flex-1 rounded bg-blue-300 p-1 text-white font-extrabold hover:duration-300 duration-150 hover:bg-blue-500'>Gửi
						</button>
						<button ref={nutHuy}
								className='rounded bg-red-300 p-1 min-w-[100px] text-white font-extrabold hover:duration-300 duration-150 hover:bg-red-500'>Hủy
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>

}
