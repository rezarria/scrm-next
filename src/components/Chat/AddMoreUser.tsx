import Chat from '@/model/Chat'
import { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react'
import CurrentUserInfoContext from '@/context/CurrentUserInfoContext'
import UserContext from '@/context/UserContext'
import UserInfo from '@/model/UserInfo'
import Image from 'next/image'
import axios from 'axios'

export interface AddMoreUserRef {
	show: () => void
	hide: () => void
}

interface AddMoreUserProps {
	chat: Chat
}

interface UserListRef {
	getSelect: () => string[]
}

interface UserListProps {
	users: UserInfo[]
}

// eslint-disable-next-line react/display-name
const UserList = forwardRef<UserListRef, UserListProps>((props, ref) => {
	let list = useRef<Set<string>>(new Set())
	useImperativeHandle(ref, () => ({getSelect: () => Array.from(list.current)}), [])
	return <>
		{
			props.users.map(user => <Item key={user.id} user={user} onClick={n => {
				if (n) list.current.add(user.id)
				else list.current.delete(user.id)
			}}/>)
		}
	</>
})

// eslint-disable-next-line react/display-name
function Item ({user, onClick}: { user: UserInfo, onClick: (r: boolean) => void }) {
	const [select, setSelect] = useState(false)
	return (
		<div className={`flex flex-row items-center gap-4 cursor-pointer p-1 rounded ${select ? 'bg-green-400' : ''}`}
			 onClick={() => {
				 setSelect(!select)
				 onClick(!select)
			 }}>
			<div className='rounded-full h-14 w-14 bg-black overflow-hidden'>
				{
					user.avatar && user.avatar.length != 0 &&
                    <Image src={user.avatar} width={300} height={300} alt='avatar'/>
				}
			</div>
			<div className='text-xl'>{user.fullName}</div>
		</div>
	)
}


// eslint-disable-next-line react/display-name
export const AddMoreUser = forwardRef<AddMoreUserRef, AddMoreUserProps>((props, ref) => {
	const [open, setOpen] = useState(false)
	const currentUser = useContext(CurrentUserInfoContext)
	const userContext = useContext(UserContext)
	const [users, setUsers] = useState<UserInfo[]>([])
	const userList = useRef<UserListRef>(null)

	useImperativeHandle(ref, () => ({
		show: () => setOpen(true),
		hide: () => setOpen(false)
	}))

	useEffect(() => {
		let idList = currentUser?.user.friends.filter(i => !props.chat.users.includes(i))
		if (userContext && idList) {
			userContext.getUsers(idList).then(data => {
				if (data) setUsers(data)
			})
		}
	}, [props.chat.users, userContext, currentUser])


	return <div>
		{
			open &&
            <div className='top-0 left-0 w-screen h-screen bg-cyan-50/50 z-30 fixed flex justify-center items-center'>
                <div className='absolute w-full h-full z-10 cursor-pointer' onClick={() => {
					setOpen(false)
				}}></div>
                <div className='rounded bg-white border p-4 z-20 flex flex-col gap-4'>
                    <h2 className='text-2xl'>Thêm người dùng</h2>
                    <div>
                        <UserList ref={userList} users={users}/>
                    </div>
                    <div className='flex flex-row'>
                        <button className='rounded-l flex-1 hover:bg-blue-500 p-2 hover:text-white' onClick={() => {
							if (userList.current) {
								axios.post('http://localhost:8080/api/user/chat/addMember', {
									id: props.chat.id,
									users: userList.current.getSelect()
								}).then(() => {
									setOpen(false)
								})
							}
						}}>Thêm
                        </button>
                        <button className='rounded-r flex-1 hover:bg-red-500 p-2 hover:text-white'
                                onClick={() => setOpen(false)}>Huỷ
                        </button>
                    </div>
                </div>
            </div>
		}
	</div>
})