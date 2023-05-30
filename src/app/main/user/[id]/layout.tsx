'use client'

import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import UserInfo from '@/model/UserInfo'
import { useRouter } from 'next/navigation'
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


const utilContext = createContext<{ func: Function }>({
	func: () => {
	}
})

export default function Layout (props: Props) {
	const [userInfo, setUserinfo] = useState<UserInfo | null>(null)
	const [self, setSelf] = useState(false)
	const [error, setError] = useState(false)
	const router = useRouter()
	const [force, setForce] = useState(true)
	let myInfo = useContext(CurrentUserInfoContext)
	const render = () => setForce(!force)
	useEffect(() => {
		if (myInfo === null) throw 'userinfo null'
		if (myInfo.user.id === props.params.id) {
			setUserinfo(myInfo.user)
			setSelf(true)
		} else
			axios.get(`http://localhost:8080/api/user/info?id=${props.params.id}`).then(r => {
				if (r.status === 200)
					setUserinfo(r.data)
			}).catch(_ => {
				setError(true)
			})
		if (myInfo.user.friends.includes(props.params.id)) {
			setSelf(true)
		}
	}, [myInfo])

	return (
		<utilContext.Provider value={{func: render}}>
			<div className='w-full h-full'>
				{error || userInfo === null ?
					<div className='text-white bg-red-700 h-auto p-2 flex flex-row justify-between items-center'>
						<span>KHÔNG TÌM THẤY NGƯỜI DÙNG</span><Button
						className='p-1' title='Quay lại trang đầu' onClick={() => {
						router.push('/')
					}}/>
					</div>
					:
					<>
						<homeUserInfo.Provider value={userInfo}>
							{userInfo && <UserHome userInfo={userInfo} addFriendButton={!self}/>}
							<DanhSachChucNang id={props.params.id} userInfo={userInfo}
											  self={myInfo?.user.id === props.params.id}/>
							{props.children}
						</homeUserInfo.Provider>
					</>}
			</div>
		</utilContext.Provider>
	)
}

function DanhSachChucNang ({id, userInfo, self}: { id: string, userInfo: UserInfo, self: boolean }) {
	return (
		<ul className='bg-neutral-300 px-14 flex flex-row gap-4 pb-2'>
			<MucChucNang name='Tường nhà' url={`/user/${id}`}/>
			<MucChucNang name='Bạn bè' url={`/user/${id}/friends`}>
				<>
					{
						userInfo.friends && <span
                            className='round bg-amber-100 p-1 rounded leading-4 inline-block text-blue-600 font-bold'>{userInfo.friends.length}</span>
					}
				</>
			</MucChucNang>
			{
				self && <MucChucNang name={'thông tin người dùng'} url={`/user/${id}/info`}/>
			}
		</ul>
	)
}

function MucChucNang (props: {
	children?: ReactNode
	name: string
	url: string
}) {
	const router = useRouter()
	return (
		<li className={`${Style.section}`}
			onClick={function (e) {
				e.currentTarget.parentElement?.querySelectorAll('li').forEach(t => t.classList.remove(Style.active))
				e.currentTarget.classList.add(Style.active)
				router.push(props.url)
			}}>{props.name} {props.children && props.children}
		</li>
	)
}


export { homeUserInfo, utilContext }
