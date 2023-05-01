'use client'

import styles from './styles.module.scss'
import React, {useState} from 'react'
import PersonIcon from '@mui/icons-material/Person'
import PasswordIcon from '@mui/icons-material/Password'
import background from './bg-login.jpg'
import axios from 'axios'
import {useRouter as useRouterNativation, useSearchParams} from 'next/navigation'

interface Props {
}

interface LoginResponse {
	token: string
}

export default function Page(props: Props) {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const routerNavigation = useRouterNativation()
	const searchParams = useSearchParams()
	const returnUrl = searchParams.get('returnUrl')
	console.log(returnUrl)
	const login = function () {
		axios.post<LoginResponse>('http://localhost:8080/api/account/login', {username, password})
			.then(res => {
				if (res.status === 200) {
					localStorage.setItem('jwt', res.data.token)
					if (returnUrl === null) routerNavigation.push('/')
					else routerNavigation.push(returnUrl)
				}
			})
			.catch(_ => {
			})
	}

	return (
		<div className={styles['main-panel']} style={{backgroundImage: `url(${background.src})`}}>
			<div className={styles['login-panel']}>
				<div className={styles['body-login-panel']}>
					<div className={styles['group-input']}>
						<label><PersonIcon color="info"/></label>
						<input type="text" onChange={e => {
							setUsername((e.target as HTMLInputElement).value)
						}}/>
					</div>
					<div className={styles['group-input']}>
						<label><PasswordIcon color="info"/></label>
						<input type="password" onChange={e => {
							setPassword((e.target as HTMLInputElement).value)
						}}/>
					</div>
					<button type="button" onClick={login} className={styles['login-button']}>LOGIN</button>
				</div>
			</div>
		</div>
	)
}