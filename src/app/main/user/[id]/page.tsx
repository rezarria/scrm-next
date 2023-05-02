'use client'

import {useContext, useEffect, useState} from 'react'
import UserInfoContext from '@/context/userInfoContext'
import UserInfo from '@/model/UserInfo'
import axios from 'axios'
import UserHome from '@/components/UserHome'
import Button from '@/components/Button'
import {useRouter} from 'next/navigation'

interface PageProps {
	params: {
		id: string
	};
}

export default function Page (props: PageProps) {
	const [userInfo, setUserinfo] = useState<UserInfo | null>(null)
	const [self, setSelf] = useState(true)
	const [error, setError] = useState(false)
	const router = useRouter()

	let myInfo = useContext(UserInfoContext)
	useEffect(() => {
		if (myInfo === null) throw 'userinfo null'
		if (myInfo.id === props.params.id) {
			setUserinfo(myInfo)
			setSelf(false)
		} else
			axios.get(`http://localhost:8080/api/user/info?id=${props.params.id}`).then(r => {
				if (r.status === 200)
					setUserinfo(r.data)
			}).catch(_ => {
				setError(true)
			})
	}, [props.params.id])

	return <>
		<div className='w-full h-full'>
			{error ? <div className='text-white bg-red-700 h-auto p-2 flex flex-row justify-between items-center'><span>KHÔNG TÌM THẤY NGƯỜI DÙNG</span><Button
				className='p-1' title='Quay lại trang đầu' onClick={() => {
				router.push('/')
			}}/></div> : <>
				{userInfo && <UserHome userInfo={userInfo} addFriendButton={self}/>}
			</>}
		</div>
	</>
}