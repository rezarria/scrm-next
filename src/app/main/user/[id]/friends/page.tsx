import FriendList from '@/components/FriendList'

interface Props {
	params: {
		id: string
	}
}

export default function Page (props: Props) {
	return (
		<div>
			<FriendList id={props.params.id}/>
		</div>
	)
}