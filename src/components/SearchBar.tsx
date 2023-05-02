'use client'

import SearchIcon from '@mui/icons-material/Search'

export default function SearchBar () {
	return (
		<div className='bg-neutral-500 rounded-full p-0.5 px-3 flex flex-row'>
			<input type='text' name='search-content' id='search-content'
				   className='bg-inherit focus:outline-none text-white order-2'/>
			<button type='button' className='order-1'><SearchIcon htmlColor='white'/></button>
		</div>
	)
}