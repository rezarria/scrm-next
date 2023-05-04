'use client'

import {useEffect, useRef} from 'react'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import CloseIcon from '@mui/icons-material/Close'
import Image from 'next/image'

export default function CreatePost () {
	const nutH = useRef<HTMLDivElement>(null)
	useEffect(() => {
		console.log(nutH.current)
	}, [])
	return <div className='bg-white mb-1'>
		<div className='px-16 py-10 w-full'>
			<div className='rounded w-full h-12 border cursor-pointer' ref={nutH}></div>
		</div>
		<div className='z-50 fixed w-full h-full top-0 left-0 bg-neutral-700/80'>
			<div className='w-1/2 mx-auto top-1/2 relative -translate-y-1/2 bg-white p-5 rounded'>
				<h1></h1>
				<textarea className='rounded w-full min-h-[200px] hover:outline-blue-600 outline-0 p-2 resize-none'/>
				<div className='flex flex-row gap-1 border-t-2 pt-2'>
					{
						[1, 2, 3].map((i) =>
							<div key={i} className='group w-20 h-20 border rounded relative'>
								<div className='absolute cursor-pointer -right-3 -top-3 bg-red-300 rounded-full w-6 h-6 leading-none hidden group-hover:block z-50'>
									<CloseIcon/></div>
								<Image className='w-full h-full object-contain' src='http://localhost:8080/api/picture/get/64348595e5cc0516300df099/64532be2ff02122afdb46e65.jpg' width='300' height='300' alt='img'/>
							</div>
						)
					}

				</div>
				<div className='mt-2 border-t-2 flex flex-col gap-1'>
					<div className='flex flex-row gap-2 justify-between'>
						<button className=''><AddPhotoAlternateIcon className='text-cyan-500'/></button>
					</div>
					<div className='flex flex-row gap-2 justify-end'>
						<button className='flex-1 rounded bg-blue-300 p-1 text-white font-extrabold hover:duration-300 duration-150 hover:bg-blue-500'>Gửi</button>
						<button className='rounded bg-red-300 p-1 min-w-[100px] text-white font-extrabold hover:duration-300 duration-150 hover:bg-red-500'>Hủy</button>
					</div>
				</div>
			</div>
		</div>
	</div>

}