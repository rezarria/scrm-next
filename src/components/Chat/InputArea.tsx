import CurrentUserInfoContext from '@/context/CurrentUserInfoContext'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import ButtonInputArea from '@/components/Chat/ButtonInputArea'

interface Props {
	id: string
}

export function InputArea (props: Props) {
	const currentUser = useContext(CurrentUserInfoContext)
	const [loading, setLoading] = useState(true)
	const textarea = useRef<HTMLTextAreaElement>(null)

	useEffect(() => {
		if (currentUser?.user) setLoading(false)
	}, [currentUser])

	const sendMessage = useCallback(() => {
		axios.post('http://localhost:8080/api/user/chat/sendMessage', {
			content: textarea.current!.value,
			chat: props.id
		}).then(r => {
			if (r.status === 200) {
				textarea.current!.value = ''
			}
		})
	}, [currentUser, textarea.current, props.id])


	if (loading) return <p>Loading...</p>


	return <>
		<div className='flex flex-row'>
			<div className='flex-grow'>
							<textarea
								ref={textarea}
								className='block w-full h-fit resize-none focus:outline-0 rounded border p-2 min-h-[2em]'
								onInput={event => {
									event.currentTarget.style.height = '2em'
									event.currentTarget.style.height = event.currentTarget.scrollHeight + event.currentTarget.offsetHeight + 'px'
								}}/>
			</div>
			<button onClick={sendMessage} className='px-6 rounded border hover:bg-blue-200 duration-500'>Gửi</button>
		</div>
		<div className='flex flex-row gap-2'>
			<ButtonInputArea/>
		</div>
	</>
}