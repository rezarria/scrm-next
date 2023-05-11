'use client'

import {useRouter} from 'next/navigation'
import PostList from '@/components/PostList'
import CreatePost from '@/components/CreatePost'

export default function Page () {
	const router = useRouter()
	return <>
		<CreatePost/>
		<PostList/>
	</>
}