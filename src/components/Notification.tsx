'use client'

import NotificationsIcon from '@mui/icons-material/Notifications';
import {useContext, useEffect, useState} from 'react';
import UserInfoContext from '@/context/userInfoContext';
import axios from 'axios';
import {default as NotificationModel} from '@/model/Notification'

export default function Notification () {
	const userInfo = useContext(UserInfoContext)
	const [notification, setNotification] = useState<NotificationModel[]>([])

	useEffect(() => {
		axios.post<NotificationModel[]>('http://localhost:8080/api/user/notification/get/getNew', {})
	}, [])

	if (userInfo === null) return <>!</>


	return (
		<div className='cursor-pointer relative'>
			<NotificationsIcon/>
			<div className='mt-1 top-full left-0 absolute w-[300px] min-h-[200px] block rounded bg-white border border-blue-400 shadow'></div>
		</div>
	)
}