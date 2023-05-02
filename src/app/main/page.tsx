'use client'

import {useRouter} from 'next/navigation'
import PostList from '@/components/PostList'

export default function Page () {
	const router = useRouter()
	return <>
		<PostList/>
	</>
}