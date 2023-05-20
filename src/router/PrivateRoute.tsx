'use client'

import {ReactNode, useEffect, useState} from 'react'
import {useRouter as userRouterNavigation} from 'next/navigation'
import axios from 'axios'
import CurrentUserInfoContext from '@/context/CurrentUserInfoContext'
import UserInfo from '@/model/UserInfo'

export interface Response {
	lastUpdate: string;
	user: UserInfo;
}

enum Status {
	LOADING, DONE, ERROR
}

interface PrivateRouteProps {
	children?: ReactNode;
}

function PrivateRoute (props: PrivateRouteProps) {
	const [status, setStatus] = useState<Status>(Status.LOADING)
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
	const navigation = userRouterNavigation()

	useEffect(() => {
		setUserInfo(JSON.parse(localStorage.getItem('user info') ?? '{}') as UserInfo)
		let jwtStr: string | null = null
		if (typeof window !== 'undefined') {
			jwtStr = localStorage.getItem('jwt')
			if (jwtStr === null) navigation.push(`/login?returnUrl=${window.location.pathname}`)
		}
		if (jwtStr !== null) {
			axios.defaults.headers.common.Authorization = 'Bearer ' + jwtStr
			getInfoFromApi()
				.then(r => {
					if (r.status === 200) {
						setStatus(Status.DONE)
						setUserInfo(r.data.user)
					}
				})
				.catch(error => {
					setStatus(Status.ERROR)
					navigation.push('/login')
				})
		}
	}, [])

	switch (status) {
		case Status.LOADING:
			return <>Đăng kiểm tra thông tin đăng nhập...</>
		case Status.DONE:
			return <>
				<CurrentUserInfoContext.Provider value={{
					user: userInfo!,
					setUser: setUserInfo,
					updateInfo: () => {
						getInfoFromApi().then(r => {
							if (r.status === 200) setUserInfo(JSON.parse(localStorage.getItem('user info') ?? '{}') as UserInfo)
						})
					}
				}}>
					{props.children}
				</CurrentUserInfoContext.Provider>
			</>
		case Status.ERROR:
			return <>SOMETHING WRONG...</>
	}
}

export default PrivateRoute

function getInfoFromApi () {
	let lastUpdate = localStorage.getItem('last update')
	if (lastUpdate === null || isNaN(Date.parse(lastUpdate))) lastUpdate = new Date().toISOString()
	return axios.post<Response>('http://localhost:8080/api/user/lastUpdate', {lastUpdate})
		.then(r => {
			if (r.status === 200) {
				localStorage.setItem('last update', r.data.lastUpdate)
				localStorage.setItem('user info', JSON.stringify(r.data.user))
			}
			return r
		})
}