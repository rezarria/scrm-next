'use client'

import {ReactNode} from 'react'
import {useRouter} from 'next/navigation'

export default function PublicRoute ({children}: { children: ReactNode }) {
	const router = useRouter()

	let jwt = localStorage.getItem('jwt')
	if (jwt !== null) router.push('/')
	return <>{children}</>
}