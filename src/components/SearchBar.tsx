'use client'

import SearchIcon from '@mui/icons-material/Search'
import { useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchBar () {
	const input = useRef<HTMLInputElement>(null)
	const router = useRouter()
	return (
		<div className='bg-neutral-500 rounded-full p-0.5 px-3 flex flex-row'>
			<input
				onKeyDown={event => {
					if (event.key === 'Enter') {
						if (input.current) {
							router.push(`/search?s=${input.current.value}`)
						}
					}
				}}
				ref={input} type='text' name='search-content' id='search-content'
				className='bg-inherit focus:outline-none text-white order-2'/>
			<button onClick={() => {
				if (input.current) {
					router.push(`/search?s=${input.current.value}`)
				}
			}} type='button' className='order-1'><SearchIcon htmlColor='white'/></button>
		</div>
	)
}