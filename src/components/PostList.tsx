import { useEffect, useRef, useState } from 'react'
import { default as PostModel } from '@/model/Post'
import axios from 'axios'
import Post from '@/components/Post'

export default function PostList () {
	const startTime = useRef(new Date())
	const endTime = useRef(new Date())
	const [posts, setPosts] = useState<PostModel[]>([])

	useEffect(() => {
		let timeout: NodeJS.Timeout | null = null
		const update = () => {
			axios.get<PostModel[]>(`http://localhost:8080/api/user/post/getMixed`, {
				params: {
					startTime: startTime.current.toISOString(), endTime: endTime.current.toISOString()
				}
			})
				.then(r => {
					if (r.status === 200) {
						let data = r.data
						if (data.length !== 0) {
							let newStartTime = new Date(r.data.reduce((p, c) => p.lastModifiedDate.localeCompare(c.lastModifiedDate) <= 0 ? p : c).lastModifiedDate)
							let newEndTime = new Date(r.data.reduce((p, c) => p.lastModifiedDate.localeCompare(c.lastModifiedDate) >= 0 ? p : c).lastModifiedDate)
							if (newStartTime < startTime.current || posts.length === 0) startTime.current = newStartTime
							if (newEndTime > endTime.current || posts.length === 0) endTime.current = newEndTime
							setPosts([...posts, ...data].sort().reverse())
						}
						timeout = setTimeout(update, 3000)
					}
				})
		}
		update()
		return () => {
			if (timeout) clearTimeout(timeout)
		}
	}, [])

	return <div className='w-full min-h-full h-fit bg-white px-16 pt-5 flex flex-col gap-2'>
		{
			posts.map(d => <Post key={d.id} data={d}/>)
		}
	</div>
}