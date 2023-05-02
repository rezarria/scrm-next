'use client'

import TopNavigator from '@/components/TopNavigator';
import SearchBar from '@/components/SearchBar';
import MenuSide, {MenuSideProps} from '@/components/MenuSide';
import {ReactNode, useContext, useEffect, useState} from 'react';
import UserInfoContext from '@/context/userInfoContext';
import PrivateRoute from '@/router/PrivateRoute';
import UserInfo from '@/model/UserInfo';
import {useRouter} from 'next/navigation';
import axios from 'axios';
import GoMain from '@/components/GoMain';

export default function RootLayout({
									   children
								   }: {
	children: ReactNode
}) {
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
	const router = useRouter()


	useEffect(() => {
		setUserInfo(JSON.parse(localStorage.getItem('user info') ?? '{}') as UserInfo)
	}, [])

	axios.interceptors.request.use(function (config) {
		return config;
	}, function (error) {
		console.log(error)
		return Promise.reject(error);
	});

	axios.interceptors.response.use(function (response) {
		return response
	}, function (error) {
		console.log(error)
		return Promise.reject(error);
	});

	return (
		<PrivateRoute>
			<UserInfoContext.Provider value={userInfo}>
				<div className='bg-blue-400 min-h-screen relative'>
					<TopNavigator leftChildren={<GoMain/>} centerChildren={<SearchBar/>}/>
					<div className='flex flex-row justify-center h-full pt-10'>
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
				router.push(`./user/${userInfo.id}`)
			}
		})
	}

	return <div className='flex-1 h-screen block fixed left-0'>
		<MenuSide {...props}/>
	</div>
}

function Center({children}: { children: ReactNode }) {
	return <div className='basis-[800px] rounded mt-2.5 overflow-hidden'>{children}</div>
}

function Right() {
	return <div className='flex-1 h-screen block fixed'></div>
}