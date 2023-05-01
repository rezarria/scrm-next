'use client'

import TopNavigator from '@/components/TopNavigator';
import SearchBar from '@/components/SearchBar';
import MenuSide, {MenuSideProps} from '@/components/MenuSide';
import {ReactNode, useContext, useEffect, useState} from 'react';
import UserInfoContext from '@/context/userInfoContext';
import PrivateRoute from '@/router/PrivateRoute';
import UserInfo from '@/model/UserInfo';
import {useRouter} from 'next/navigation';

export default function RootLayout({
									   children
								   }: {
	children: ReactNode
}) {
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

	useEffect(() => {
		setUserInfo(JSON.parse(localStorage.getItem('user info') ?? '{}') as UserInfo)
	}, [])

	return (
		<PrivateRoute>
			<UserInfoContext.Provider value={userInfo}>
				<div className="bg-blue-400 h-screen relative">
					<TopNavigator centerChildren={<SearchBar/>}/>
					<div className="flex h-full pt-10">
						<Left/>
						<Center>
							{children}
						</Center>
						<Right/>
					</div>
				</div>
			</UserInfoContext.Provider>
		</PrivateRoute>
	)
}

function Left() {
	const userInfo = useContext(UserInfoContext)
	const router = useRouter()

	const props: MenuSideProps = {
		items: []
	}

	if (userInfo !== null) {
		props.items?.push({
			icon: userInfo.avatar,
			title: userInfo.fullName,
			onClick: () => {
				router.push(`/main/user/${userInfo.id}`)
			}
		})
	}

	return <div className="flex-1">
		<MenuSide {...props}/>
	</div>
}

function Center({children}: { children: ReactNode }) {
	return <div className="flex-1">{children}</div>
}

function Right() {
	return <div className="flex-1"></div>
}