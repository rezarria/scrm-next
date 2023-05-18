'use client'

import Style from './style.module.scss'
import {forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState} from 'react'
import UserInfo from '@/model/UserInfo'
import userInfoContext from '@/context/userInfoContext'
import axios from 'axios'

export default function Page () {
	const [userInfo, setUserInfo] = useState<UserInfo | null>(useContext(userInfoContext))
	let fullName = useRef<InputRef>(null)
	let avatar = useRef<InputRef>(null)
	let background = useRef<InputRef>(null)


	if (userInfo === null) return <div>Loading....</div>

	return (
		<div className='flex flex-col bg-white px-16 py-6 gap-4'>
			<TextInput ref={fullName} title='Họ tên' init={userInfo.fullName ? userInfo.fullName : ''}/>
			<ImageInput ref={avatar} title='Avatar' init={userInfo.avatar ? userInfo.avatar : ''}/>
			<ImageInput ref={background} title='Ảnh nền' init={userInfo.background ? userInfo.background : ''}/>
			<button className='rounded p-2 bg-blue-400 text-white font-bold' onClick={event => {
				axios.post('http://localhost:8080/api/user/update', {
					fullName: fullName.current!.get(),
					avatar: avatar.current!.get(),
					background: background.current!.get()
				})
			}}>Lưu
			</button>
			<ThongBao/>
		</div>
	)
}

type ThongBaoRef = {
	show: (n: boolean) => void
}

type ThongBaoProps = {}

// eslint-disable-next-line react/display-name
const ThongBao = forwardRef<ThongBaoRef, ThongBaoProps>((props, ref) => {
	const [status, setStatus] = useState(false)

	useImperativeHandle(ref, () => ({
		show: n => {
			setStatus(n)
		}
	}))

	if (status)
		return <div className='bg-green-600 p-2 text-center text-white font-bold rounded'>Thành công</div>
	else return <div className='bg-red-600 p-2 text-center text-white font-bold rounded'>Thất bại</div>
})


type InputRef = {
	get: () => string
} | null

type InputProps = {
	title: string
	init: string
}

// eslint-disable-next-line react/display-name
const TextInput = forwardRef<InputRef, InputProps>(
	(props, ref) => {
		let inp = useRef<HTMLInputElement>(null)
		useImperativeHandle(ref, () => ({
			get: () => {
				return inp.current!.value
			}
		}))

		useEffect(() => {
			inp.current!.value = props.init
		}, [])

		return (
			<div className={Style.inputGroup}>
				<label>{props.title}</label>
				<input ref={inp} type='text'/>
			</div>
		)
	}
)

// eslint-disable-next-line react/display-name
const ImageInput = forwardRef<InputRef, InputProps>(
	(props, ref) => {
		let file = useRef<HTMLInputElement>(null)
		let value = useRef<HTMLInputElement>(null)
		useImperativeHandle(ref, () => ({
			get: () => {
				return value.current!.value
			}
		}))

		useEffect(() => {
			value.current!.value = props.init
		}, [])

		console.log('reload!')
		return (
			<div className={Style.inputGroup}>
				<label>{props.title}</label>
				<div className={Style.groupFile}>
					<input ref={file} type='file' className='hidden' onChange={event => {
						if (file.current) {
							let f = file.current
							if (f.files) {
								let form = new FormData()
								form.append('files', f.files[0])
								axios.post('http://localhost:8080/api/user/picture/upload', form)
									.then(r => {
										if (r.status === 200) {
											value.current!.value = 'http://localhost:8080/api/picture/get/' + r.data[0]['second']
										}
									})
							}
						}
					}}/>
					<button onClick={event => {
						if (file.current) {
							let f = file.current
							f.click()
						}
					}}>chọn ảnh
					</button>
					<input ref={value} type='text'/>
				</div>
			</div>
		)
	}
)