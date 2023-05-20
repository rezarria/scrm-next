'use client'

import NotificationsIcon from '@mui/icons-material/Notifications'
import {useContext, useEffect, useRef, useState} from 'react'
import CurrentUserInfoContext from '@/context/CurrentUserInfoContext'
import axios from 'axios'
import {default as NotificationModel} from '@/model/Notification'
import NotificationItem from '@/components/NotificationItem'

export default function Notification () {
	const userInfo = useContext(CurrentUserInfoContext)
	const [notification, setNotification] = useState<NotificationModel[]>([])
	let startTime = useRef(new Date().toISOString())
	let endTime = useRef(new Date().toISOString())
	let job: Promise<void> | null = null
	useEffect(() => {
		let fetching = false
		const getNotification = () => {
			if (fetching) return
			fetching = true
			axios.post<NotificationModel[]>(`http://localhost:8080/api/user/notification/getNew?startTime=${startTime.current}&endTime=${endTime.current}`)
				.then(r => {
					if (r.status === 200) {
						if (r.data.length !== 0) {
							let min = r.data.filter(x => x.lastModifiedDate.localeCompare(startTime.current) < 0).sort()
							let max = r.data.filter(x => x.lastModifiedDate.localeCompare(endTime.current) > 0).sort().reverse()
							if (max.length > 0) endTime.current = max[0].lastModifiedDate
							if (min.length > 0) startTime.current = min[0].lastModifiedDate
							setNotification([...notification, ...r.data].sort((a, b) => a.lastModifiedDate.localeCompare(b.lastModifiedDate)))
						}
					}
				})
				.finally(() => {
					fetching = false
					setTimeout(getNotification, 3000)
				})
		}
		getNotification()

	}, [])

	if (userInfo === null) return <>!</>


	return (
		<div className='cursor-pointer relative'>
			<NotificationsIcon/>
			<div
				className='mt-1 top-full left-0 absolute w-[300px] min-h-[200px] block rounded bg-white border border-blue-400 shadow'>
				{
					notification && notification.map(n => <NotificationItem key={n.id} notificationData={n}/>)
				}
			</div>
		</div>
	)
}