'use client'

import TopNavigator from '@/components/TopNavigator'
import SearchBar from '@/components/SearchBar'
import MenuSide, {MenuSideProps} from '@/components/MenuSide'
import {ReactNode, useContext, useEffect, useState} from 'react'
import UserInfoContext from '@/context/userInfoContext'
import PrivateRoute from '@/router/PrivateRoute'
import UserInfo from '@/model/UserInfo'
import {useRouter} from 'next/navigation'
import axios from 'axios'
import GoMain from '@/components/GoMain'
import UserContext, {createInit, UserContextState} from '@/context/UserContext'

function thietLapAxios () {
	axios.interceptors.request.use(function (config) {
		return config
	}, function (error) {
		console.log(error)
		return Promise.reject(error)
	})

	axios.interceptors.response.use(function (response) {
		return response
	}, function (error) {
		console.log(error)
		return Promise.reject(error)
	})
}

export default function RootLayout ({
										children
									}: {
	children: ReactNode
}) {
	const [users, setUsers] = useState<UserInfo[]>([])
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
	const [userContextValue] = useState<UserContextState>(createInit({users, setUsers}))

	useEffect(() => {
		setUserInfo(JSON.parse(localStorage.getItem('user info') ?? '{}') as UserInfo)
	}, [])

	thietLapAxios()

	return (
		<PrivateRoute>
			<UserContext.Provider value={userContextValue}>
				<UserInfoContext.Provider value={userInfo}>
					<div className='bg-blue-400 min-h-screen relative'>
						<TopNavigator leftChildren={<GoMain/>} centerChildren={<SearchBar/>}/>
						<div className='flex flex-row justify-center h-screen box-border pt-10'>
							<Left/>
							<Center>
								{children}
							</Center>
							<Right/>
						</div>
					</div>
				</UserInfoContext.Provider>
			</UserContext.Provider>
		</PrivateRoute>
	)
}

function Left () {
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

function Center ({children}: { children: ReactNode }) {
	return <div className='basis-[800px] h-full pt-2.5'>
		<div className='w-full h-full rounded overflow-hidden box-border'>
			{children}
		</div>
	</div>
}

function Right () {
	return <div className='flex-1 h-screen block fixed'></div>
}