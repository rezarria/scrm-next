'use client'

import TopNavigator from '@/components/TopNavigator'
import SearchBar from '@/components/SearchBar'
import MenuSide, { MenuSideProps } from '@/components/MenuSide'
import { ReactNode, useContext } from 'react'
import CurrentUserInfoContext from '@/context/CurrentUserInfoContext'
import PrivateRoute from '@/router/PrivateRoute'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import GoMain from '@/components/GoMain'
import { UserContextProvider } from '@/context/UserContext'
import Notification from '@/components/Notification'
import LogoutIcon from '@mui/icons-material/Logout'
import { deleteAllCookies } from '@/utils/function'

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

	thietLapAxios()

	return (
		<PrivateRoute>
			<UserContextProvider>
				<div className='bg-blue-400 min-h-screen relative'>
					<TopNavigator leftChildren={<GoMain/>} centerChildren={<SearchBar/>} rightChildren={
						<Notification/>}/>
					<div className='flex flex-row justify-center min-h-screen box-border pt-10'>
						<Left/>
						<Center>
							{children}
						</Center>
						<Right/>
					</div>
				</div>
			</UserContextProvider>
		</PrivateRoute>
	)
}

function Left () {
	const userInfo = useContext(CurrentUserInfoContext)
	const router = useRouter()

	const props: MenuSideProps = {
		items: []
	}

	if (userInfo !== null) {
		props.items?.push({
			icon: userInfo.user.avatar,
			title: userInfo.user.fullName,
			onClick: () => {
				router.push(`./user/${userInfo.user.id}`)
			}
		})
		props.items?.push({
			iconElement: <div className={'w-full h-full relative'}>
				<LogoutIcon className='w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'/>
			</div>,
			title: 'Đăng xuất',
			onClick: () => {
				localStorage.clear()
				deleteAllCookies()
				router.push('/login')
			}
		})
	}

	return <div className='flex-1 h-screen top-0 pt-10 block fixed left-0'>
		<MenuSide {...props}/>
	</div>
}

function Center ({children}: { children: ReactNode }) {
	return <div className='w-[800px] min-h-screen pt-2.5'>
		<div className='w-full min-h-full rounded overflow-hidden box-border'>
			{children}
		</div>
	</div>
}

function Right () {
	return <div className='flex-1 h-screen top-0 pt-10 block fixed right-0'>
	</div>
}