'use client'

import {createContext, ReactNode, useContext, useEffect, useState} from 'react'
import UserInfo from '@/model/UserInfo'
import {useRouter} from 'next/navigation'
import CurrentUserInfoContext from '@/context/CurrentUserInfoContext'
import axios from 'axios'
import Button from '@/components/Button'
import UserHome from '@/components/UserHome'
import Style from './styles.module.scss'

interface Props {
	children: ReactNode
	params: {
		id: string
	}
}

const homeUserInfo = createContext<UserInfo | null>(null)

export {homeUserInfo}

export default function Layout (props: Props) {
	const [userInfo, setUserinfo] = useState<UserInfo | null>(null)
	const [self, setSelf] = useState(true)
	const [error, setError] = useState(false)
	const router = useRouter()
	let myInfo = useContext(CurrentUserInfoContext)
	useEffect(() => {
		if (myInfo === null) throw 'userinfo null'
		if (myInfo.user.id === props.params.id) {
			setUserinfo(myInfo.user)
			setSelf(false)
		} else
			axios.get(`http://localhost:8080/api/user/info?id=${props.params.id}`).then(r => {
				if (r.status === 200)
					setUserinfo(r.data)
			}).catch(_ => {
				setError(true)
			})
	}, [myInfo])

	return <div className='w-full h-full'>
		{error ?
			<div className='text-white bg-red-700 h-auto p-2 flex flex-row justify-between items-center'>
				<span>KHÔNG TÌM THẤY NGƯỜI DÙNG</span><Button
				className='p-1' title='Quay lại trang đầu' onClick={() => {
				router.push('/')
			}}/>
			</div>
			:
			<>
				<homeUserInfo.Provider value={userInfo}>
					{userInfo && <UserHome userInfo={userInfo} addFriendButton={self}/>}
					<ul className='bg-neutral-300 px-14 flex flex-row gap-4 pb-2'>
						<li className={`${Style.section} ${window.location.href.endsWith(`/user/${props.params.id}`) && Style.active}`}
							onClick={function (e) {
								e.currentTarget.parentElement?.querySelectorAll('li').forEach(t => t.classList.remove(Style.active))
								e.currentTarget.classList.add(Style.active)
								router.push(`/user/${props.params.id}`)
							}}>Tường nhà
						</li>
						<li className={`${Style.section} ${window.location.href.endsWith(`/user/${props.params.id}/friends`) && Style.active}`}
							onClick={function (e) {
								e.currentTarget.parentElement?.querySelectorAll('li').forEach(t => t.classList.remove(Style.active))
								e.currentTarget.classList.add(Style.active)
								router.push(`/user/${props.params.id}/friends`)
							}}>
							bạn bè <span
							className='round bg-amber-100 p-1 rounded leading-4 inline-block text-blue-600 font-bold'>{userInfo?.friends?.length}</span>
						</li>
					</ul>
					{props.children}
				</homeUserInfo.Provider>
			</>}
	</div>
}