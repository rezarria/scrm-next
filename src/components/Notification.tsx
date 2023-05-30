'use client'

import NotificationsIcon from '@mui/icons-material/Notifications'
import { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react'
import CurrentUserInfoContext from '@/context/CurrentUserInfoContext'
import axios from 'axios'
import { default as NotificationModel } from '@/model/Notification'
import NotificationItem from '@/components/NotificationItem'

export default function Notification () {
	const userInfo = useContext(CurrentUserInfoContext)
	const [notification, setNotification] = useState<NotificationModel[]>([])
	let startTime = useRef(new Date().toISOString())
	let endTime = useRef(new Date().toISOString())
	const modal = useRef<ModalRef>(null)
	const number = useRef<NotifiNumberRef>(null)

	let job: Promise<void> | null = null
	useEffect(() => {
		let fetching = false
		let timeout: NodeJS.Timeout | null = null
		const getNotification = () => {
			if (fetching) return
			fetching = true
			axios.post<NotificationModel[]>(`http://localhost:8080/api/user/notification/getNew?startTime=${startTime.current}&endTime=${endTime.current}`)
				.then(r => {
					if (r.status === 200) {
						if (r.data.length !== 0) {
							let min = r.data.filter(x => x.lastModifiedDate.localeCompare(startTime.current) < 0 || notification.length === 0).sort()
							let max = r.data.filter(x => x.lastModifiedDate.localeCompare(endTime.current) > 0 || notification.length === 0).sort().reverse()
							if (max.length > 0) endTime.current = max[0].lastModifiedDate
							if (min.length > 0) startTime.current = min[0].lastModifiedDate
							setNotification([...notification, ...r.data].sort((a, b) => b.lastModifiedDate.localeCompare(a.lastModifiedDate)))
							number.current?.show(r.data.length)
						}
					}
				})
				.finally(() => {
					fetching = false
					timeout = setTimeout(getNotification, 3000)
				})
		}
		getNotification()
		return () => {
			if (timeout) clearTimeout(timeout)
		}
	}, [])
	if (userInfo === null) return <>!</>
	return (
		<div className='cursor-pointer relative w-fit'>
			<div onClick={() => {
				modal.current?.show()
				number.current?.hide()
			}}
				 className={'relative'}
			>
				<NotificationsIcon/>
				<NotifiNumber ref={number}/>
			</div>
			<Modal ref={modal} notification={notification}/>
		</div>
	)
}


interface NotifiNumberRef {
	hide: () => void
	show: (n: number) => void
}

// eslint-disable-next-line react/display-name
const NotifiNumber = forwardRef<NotifiNumberRef, {}>((props, ref) => {
	const [show, setShow] = useState(false)
	const [number, setNumber] = useState(0)
	useImperativeHandle(ref, () => ({
		hide: () => {
			setShow(false)
		},
		show: (n) => {
			setNumber(n)
			setShow(true)
		}
	}), [])
	return (
		<div
			className={`absolute left-1/2 z-20 top-full rounded-full w-fit p-1 bg-yellow-400 flex justify-center items-center ${show ? '' : 'hidden'}`}>
			<span className={'text-white font-bold'}>{number}</span>
		</div>
	)
})

interface ModalRef {
	show: () => void
	hide: () => void
}

// eslint-disable-next-line react/display-name
const Modal = forwardRef<ModalRef, { notification: NotificationModel[] }>((props, ref) => {
	{
		const [show, setShow] = useState(false)
		const modal = useRef<HTMLDivElement>(null)
		useImperativeHandle(ref, () => ({
			show: () => {
				setShow(true)
			},
			hide: () => {
				setShow(false)
			}
		}), [])

		useEffect(() => {
			if (show) {
				const outsideClick = (ev: MouseEvent) => {
					if (modal.current) {
						if (!modal.current.contains(ev.target as Node)) {
							setShow(false)
						}
					}
				}
				document.addEventListener('click', outsideClick)
				return () => {
					document.removeEventListener('click', outsideClick)
				}
			}
		}, [show])

		return <>
			{
				show && <div ref={modal}
                             className='mt-1 top-full left-0 absolute w-[300px] min-h-[200px] block rounded bg-white border border-blue-400 shadow'>
					{
						props.notification && props.notification.map(n => <NotificationItem key={n.id}
																							notificationData={n}/>)
					}
                </div>
			}
		</>
	}
})