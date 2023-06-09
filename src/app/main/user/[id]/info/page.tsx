'use client'

import Style from './style.module.scss'
import { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react'
import UserInfo from '@/model/UserInfo'
import CurrentUserInfoContext from '@/context/CurrentUserInfoContext'
import axios from 'axios'
import Image from 'next/image'

export default function Page () {
	let currentUserContext = useContext(CurrentUserInfoContext)
	const [userInfo, setUserInfo] = useState<UserInfo | null>(currentUserContext?.user ?? null)
	let fullName = useRef<InputRef>(null)
	let avatar = useRef<InputRef>(null)
	let background = useRef<InputRef>(null)
	let thongBaoRef = useRef<ThongBaoRef>(null)
	useEffect(() => {
		thongBaoRef.current!.show(true)
	}, [])

	if (userInfo === null) return <div>Loading....</div>

	return (
		<div className='flex flex-col bg-white px-16 py-6 gap-4'>
			<TextInput ref={fullName} title='Họ tên' init={userInfo.fullName ? userInfo.fullName : ''}/>
			<ChangePassword id={userInfo.id}/>
			<ImageInput ref={avatar} title='Avatar' init={userInfo.avatar ? userInfo.avatar : ''}/>
			<ImageInput ref={background} title='Ảnh nền' init={userInfo.background ? userInfo.background : ''}/>
			<button className='rounded p-2 bg-blue-400 text-white font-bold' onClick={event => {
				axios.post('http://localhost:8080/api/user/update', {
					fullName: fullName.current!.get(),
					avatar: avatar.current!.get(),
					background: background.current!.get()
				}).then(r => {
					if (r.status === 200) {
						currentUserContext?.updateInfo()
					}
				})
			}}>Lưu
			</button>
			<ThongBao ref={thongBaoRef}/>
		</div>
	)
}

function ChangePassword (props: { id: string }) {
	const modal = useRef<HTMLDivElement>(null)
	const submitButton = useRef<SubmitButtonRef>(null)
	const passwordInput = useRef<NewPasswordInputRef>(null)

	return (
		<div className='flex flex-row'>
			<label className='w-[25%]'>Mật khẩu</label>
			<button
				onClick={() => {
					modal.current?.classList.remove('hidden')
				}}
				className='rounded bg-green-300 p-2 text-gray-500 font-bold w-fit'>Đổi mật khẩu
			</button>
			<div ref={modal} className={'fixed top-0 left-0 w-screen h-screen bg-green-300/50 z-[100] hidden'}>
				<div
					className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded bg-white border p-4 w-1/3 flex flex-col gap-4'>
					<h2 className={'text-2xl'}>Đổi mật khẩu</h2>
					<div className={'flex flex-col gap-2'}>
						<NewPasswordInput ref={passwordInput} unlock={submitButton.current?.unlock}
										  lock={submitButton.current?.lock}/>
					</div>
					<div className={'pl-[25%] w-full flex flex-row justify-between'}>
						<SubmitButton ref={submitButton} userId={props.id}
									  getPassword={() => passwordInput.current!.getPassword()}
									  closeModal={() => {
										  modal.current?.classList.add('hidden')
									  }}
						/>
						<button
							onClick={() => {
								modal.current?.classList.add('hidden')
							}}
							className={'flex-1 rounded rounded-l-none border border-l-0 cursor-pointer hover:bg-blue-400 p-2 text-xl'}>Hủy
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}


interface NewPasswordInputRef {
	getPassword: () => { old: string, new: string }
}

interface NewPasswordProps {
	lock?: Function
	unlock?: Function
}

// eslint-disable-next-line react/display-name
const NewPasswordInput = forwardRef<NewPasswordInputRef, NewPasswordProps>((props, ref) => {
	const [input0, setInput0] = useState('')
	const [input1, setInput1] = useState('')
	const [input2, setInput2] = useState('')
	useImperativeHandle(ref, () => ({
		getPassword: () => {
			if (input0.length != 0 && input1.length != 0 && input1.localeCompare(input2) == 0)
				return {old: input0, new: input1}
			else return {old: '', new: ''}
		}
	}), [input0, input1, input2])
	if (input0.length != 0 && input1.length != 0 && input1.localeCompare(input2) == 0)
		props.unlock?.()
	else
		props.lock?.()
	return <>
		<div className={Style.inputGroup}>
			<label>Mật khẩu cũ</label>
			<input type='text' className={`${Style.password}`} onChange={e => setInput0(e.target.value)}/>
		</div>
		<div className={Style.inputGroup}>
			<label>Mật khẩu mới</label>
			<input type='text' className={`${Style.password}`} onChange={e => setInput1(e.target.value)}/>
		</div>
		<div className={Style.inputGroup}>
			<label>Nhập mật khẩu mới</label>
			<input type='text' className={`${Style.password}`} onChange={e => setInput2(e.target.value)}/>
		</div>
	</>
})

interface SubmitButtonRef {
	lock: () => void
	unlock: () => void
}

interface SubmitButtonProps {
	userId: string
	getPassword: () => { old: string, new: string }
	closeModal: Function
}


// eslint-disable-next-line react/display-name
const SubmitButton = forwardRef<SubmitButtonRef, SubmitButtonProps>((props, ref) => {
	const [lock, setLock] = useState(true)
	useImperativeHandle(ref, () => ({
		lock: () => {
			setLock(true)
		},
		unlock: () => {
			setLock(false)
		}
	}), [])

	if (lock) return (
		<button
			className={' flex-1 rounded rounded-r-none border border-r-0 hover:bg-red-400 p-2 text-xl cursor-no-drop'}>...
		</button>
	)

	return (
		<button
			onClick={() => {
				let data = props.getPassword()
				axios.post('http://localhost:8080/api/account/changePassword', {
					userId: props.userId,
					oldPassword: data.old,
					newPassword: data.new
				}).then(r => {
					if (r.status === 200) {
						props.closeModal()
					}
				})
			}}
			className={' flex-1 rounded rounded-r-none border border-r-0 cursor-pointer hover:bg-blue-400 p-2 text-xl'}>Đổi
		</button>
	)
})


type ThongBaoRef = {
	show: (status: boolean, n?: number) => void
}

type ThongBaoProps = {}

// eslint-disable-next-line react/display-name
const ThongBao = forwardRef<ThongBaoRef, ThongBaoProps>((props, ref) => {
	const [status, setStatus] = useState(false)
	const [show, setShow] = useState(false)

	useImperativeHandle(ref, () => ({
		show: (status, n) => {
			if (n === undefined) n = 5000
			setShow(true)
			setStatus(status)
			setTimeout(args => {
				setShow(false)
			}, n)
		}
	}))

	let classes = show ? '' : 'hidden'

	if (status)
		return <div className={`bg-green-600 p-2 text-center text-white font-bold rounded ${classes}`}>Thành công</div>
	else return <div className={`bg-red-600 p-2 text-center text-white font-bold rounded ${classes}`}>Thất bại</div>
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
		const [url, setUrl] = useState(props.init)

		useImperativeHandle(ref, () => ({
			get: () => {
				return value.current!.value
			}
		}))

		useEffect(() => {
			value.current!.value = props.init
		}, [])

		return (
			<div className={Style.inputGroup}>
				<label>{props.title}</label>
				<div className='flex flex-col'>
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
						<input ref={value} type='text' onChange={event => setUrl(event.target.value)}/>
					</div>
					{
						url.length !== 0 &&
                        <Image className='border p-1 max-h-48 object-cover' src={url} width={300}
                               height={300} alt={''}/>
					}
				</div>
			</div>
		)
	}
)