'use client'

import TopNavigator from '@/components/TopNavigator'
import SearchBar from '@/components/SearchBar'
import MenuSide, {MenuSideProps} from '@/components/MenuSide'
import {ReactNode, useContext, useEffect, useRef, useState} from 'react'
import UserInfoContext from '@/context/userInfoContext'
import PrivateRoute from '@/router/PrivateRoute'
import UserInfo from '@/model/UserInfo'
import {useRouter} from 'next/navigation'
import axios from 'axios'
import GoMain from '@/components/GoMain'
import UserContext, {UserContextState} from '@/context/UserContext'
import Notification from '@/components/Notification'

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
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
	const users = useRef<UserInfo[]>([])
	const job = useRef<{ task: Promise<UserInfo | null | undefined> | null }>({task: null})
	let userContextValue: UserContextState = {
		getUser: async id => {
			console.log('bắt đầu truy vấn')
			let user = users.current.find(x => x.id === id)
			if (user !== undefined) return user
			console.log('không tìm thấy user trong cache, truy vấn api')

			while (true) {
				if (job.current.task !== null) {
					console.log('đang có bên khác yêu cầu. đợi....')
					await job.current.task
					console.log('đợi xong...')
				}

				user = users.current.find(x => x.id === id)
				if (user === undefined) break
				console.log(`${id} đã được lấy từ yêu cầu khác, huỷ truy vấn api`)
				return user
			}

			console.log(`bắt đầu truy vấn thông tin với id ${id}`)
			job.current.task = axios.get<UserInfo>(`http://localhost:8080/api/user/info?id=${id}`)
				.then(r => {
					if (r.status === 200) {
						users.current.push(r.data)
						return r.data
					}
					return null
				}).finally(() => {
					job.current.task = null
				})

			return await job.current.task
		}
	}


	useEffect(() => {
		setUserInfo(JSON.parse(localStorage.getItem('user info') ?? '{}') as UserInfo)
	}, [])

	thietLapAxios()

	return (
		<PrivateRoute>
			<UserContext.Provider value={userContextValue}>
				<UserInfoContext.Provider value={userInfo}>
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