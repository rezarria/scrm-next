import '../globals.css'
import { ReactNode } from 'react'
import { WithRouterProps } from 'next/dist/client/with-router'

export const metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app'
}

interface PublicLayout extends WithRouterProps {
	children: ReactNode;
}

export default function PublicLayout ({children}: PublicLayout) {
	return (
		<>{children}</>
	)
}
