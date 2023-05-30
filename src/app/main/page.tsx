'use client'

import PostList from '@/components/PostList'
import CreatePost from '@/components/CreatePost'

export default function Page () {
	return <>
		<CreatePost/>
		<PostList/>
	</>
}