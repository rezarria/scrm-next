import {default as PostModel} from '@/model/Post'
import UserInfoById from '@/components/Post/UserInfoById'
import StatusZoneById from '@/components/Post/StatusZoneById'

interface PostProps {
	data: PostModel;
}

export default function Post (props: PostProps) {
	return <div className='w-full border bg-neutral-200 rounded-2xl p-4 min-h-[200px] flex flex-col gap-3'>
		<UserInfoById id={props.data.createdBy} underName={<>
			<div>{format(props.data.createdDate)}</div>
		</>}/>
		<div className='px-16'>
			<div>{props.data.content}</div>
			<StatusZoneById id={props.data.id}/>
		</div>
	</div>
}

function format (time: string): string {
	let date = new Date(time)
	return `${date.getHours()}:${date.getMinutes()} ${date.getDay() + 1}/${date.getMonth() + 1}/${date.getFullYear()}`
}