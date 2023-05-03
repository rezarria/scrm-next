import {useContext, useEffect, useState} from 'react'
import UserInfoContext from '@/context/userInfoContext'
import {default as PostModel} from '@/model/Post'
import axios from 'axios'
import Post from '@/components/Post'

export default function PostList () {
	const userInfo = useContext(UserInfoContext)
	const [oldestTime, setOldestTime] = useState(new Date().toISOString())
	const [posts, setPosts] = useState<PostModel[]>([])

	useEffect(() => {
		axios.get<PostModel[]>(`http://localhost:8080/api/user/post/getByTime?endTime=${oldestTime}`)
			.then(r => {
				if (r.status === 200) {
					let data = r.data
					if (data.length !== 0) {
						let old = Math.min(...r.data.map(x => Date.parse(x.lastModifiedDate)))
						setOldestTime(new Date(old).toISOString())
						setPosts([...posts, ...data])
					}
				}
			})
	}, [oldestTime])

	return <div className='w-full min-h-full h-fit bg-white px-16 pt-5 flex flex-col gap-2'>
		{
			posts.map(d => <Post key={d.id} data={d}/>)
		}
	</div>
}