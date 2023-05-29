'use client'

import { MutableRefObject, useContext, useEffect, useRef, useState } from 'react'
import CurrentUserInfoContext from '@/context/CurrentUserInfoContext'
import { getFriends } from '@/utils/function'
import FriendInfo from '@/model/FriendInfo'
import Image from 'next/image'
import axios from 'axios'

interface Props {
	userId?: string
}

export default function CreateNewSession (props: Props) {
	const [friends, setFriends] = useState<FriendInfo[]>([])
	let userInfo = useContext(CurrentUserInfoContext)
	let modal = useRef<HTMLDivElement>(null)
	let selectList = useRef<Set<string>>(new Set())
	let tenPhong = useRef<HTMLInputElement>(null)

	useEffect(() => {
		getFriends().then(data => {
			setFriends(data)
		})
	}, [])

	let friendItems = friends.map(k => <FriendItem key={k.id} data={k} list={selectList}/>)

	return <>
		{userInfo && <>
            <div className='group m-2 text-center border rounded cursor-pointer hover:bg-blue-400 duration-300'
                 onClick={event => {
					 modal.current?.classList.toggle('hidden')
				 }}>
                <span className='group-hover:text-white duration-100 text-xl'>+</span>
            </div>
            <div ref={modal} className='fixed h-screen w-screen z-10 flex justify-center items-center hidden'>
                <div className='absolute w-screen h-screen bg-white/50 top-0 left-0 -z-10' onClick={event => {
					modal.current?.classList.add('hidden')
				}}></div>
                <div className='bg-blue-400 p-2 rounded flex flex-col gap-2'>
                    <div className='rounded border'><input type='text' className='focus:outline-0 p-1'
                                                           placeholder='tên người dùng'/></div>
                    <div className='flex flex-col gap-2'>
						{friendItems}
                    </div>
                    <div>
                        <input ref={tenPhong} className='w-full rounded focus:outline-0 py-1 px-1'
                               placeholder='tên phòng' type={'text'}/>
                    </div>
                    <div>
                        <button className='rounded bg-white w-full p-2' onClick={() => {
							if (selectList.current.size != 0) {
								axios.post('http://localhost:8080/api/user/chat/createSession', {
									name: tenPhong.current!.value,
									users: [...Array.from(selectList.current), userInfo?.user.id]
								}).then(r => {
									if (r.status === 200) {
										modal.current!.classList.add('hidden')
									}
								})
							}
						}}>Tạo
                        </button>
                    </div>
                </div>
            </div>
        </>
		}
	</>
}


// eslint-disable-next-line react/display-name
function FriendItem (props: { data: FriendInfo, list: MutableRefObject<Set<string>> }) {
	const [selected, setSelected] = useState(false)

	return (
		<div key={props.data.id}
			 className={`flex flex-row gap-2 rounded p-2 cursor-pointer ${selected ? 'bg-green-400' : 'bg-white'}`}
			 onClick={() => {
				 setSelected(!selected)
				 if (selected) props.list.current.delete(props.data.id)
				 else props.list.current.add(props.data.id)
			 }}>
			<div className='rounded-full w-10 h-10 overflow-hidden bg-black'>
				{props.data.avatar !== null && <Image src={props.data.avatar} alt='' width={200} height={200}/>}
			</div>
			<div>
				{props.data.fullName}
			</div>
		</div>
	)
}