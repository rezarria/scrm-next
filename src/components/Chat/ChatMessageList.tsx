import {useContext, useEffect, useInsertionEffect, useState} from 'react'
import ChatMessageContext from '@/context/ChatMessageContext'
import ChatMessage from '@/components/Chat/ChatMessage'
import CurrentUserInfoContext from '@/context/CurrentUserInfoContext'

export default function ChatMessageList() {
    let messageContext = useContext(ChatMessageContext)
    let currentUser = useContext(CurrentUserInfoContext)
    const [force, setForce] = useState(Date.now)
    const update = () => {
        setForce(Date.now)
    }

    useEffect(() => {


        if (messageContext) {
            console.log('đã đăng ký')
            messageContext.subscribe(update)
        }

        return () => {
            console.log('hủy đăng ký')
            messageContext?.unsubscribe(update)
        }

    }, [])

    useInsertionEffect(() => {

    }, [messageContext!.getTime()])


    console.log('render lại danh sách tin ngắn')
    if (currentUser?.user == null) return <p>dang nhap tin nhan ...</p>


    return <>
        {
            messageContext!
                .getAll()
                .map(m => <ChatMessage key={m.id} content={m.content}
                                       left={m.id.localeCompare(currentUser!.user!.id) !== 0}
                                       userId={m.createBy}/>).reverse()
        }
    </>
}