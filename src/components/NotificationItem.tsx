import Notification, {Mode} from '@/model/Notification'

interface Props {
	notificationData: Notification
}

export default function NotificationItem (props: Props) {
	let content = ''

	switch (props.notificationData.mode) {
		case Mode.FriendRequest: {
			content = 'Lời mời kết bạn từ '
		}
	}

	return (
		<div className='group p-2 hover:bg-blue-500 hover:duration-100 duration-300'>
			<div className='w-10 h-10 block bg-amber-100 rounded-full group-hover:border group-hover:border-black'></div>
			<div>{content}</div>
		</div>
	)
}