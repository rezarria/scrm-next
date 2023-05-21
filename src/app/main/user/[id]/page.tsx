'use client'

import PostList from '@/components/PostList'
import { useContext } from 'react'
import { homeUserInfo } from '@/app/main/user/[id]/layout'
import { useRouter } from 'next/navigation'

interface PageProps {
	params: {
		id: string
	}
}


export default function Page (props: PageProps) {
	const userInfo = useContext(homeUserInfo)
	const route = useRouter()
	return (
		<>
			<PostList/>
		</>)
}