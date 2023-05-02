import {default as PostModel} from '@/model/Post'
import UserInfoById from '@/components/Post/UserInfoById'

interface PostProps {
	data: PostModel;
}

export default function Post (props: PostProps) {
	return <div className='w-full border border-red-500 min-h-[200px]'>
		<UserInfoById id={props.data.createdBy}/>
	</div>
}