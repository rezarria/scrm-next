import axios from 'axios'
import FriendInfo from '@/model/FriendInfo'

export function getFriends () {
	return axios.get<FriendInfo[]>('http://localhost:8080/api/user/friend/list')
		.then(r => {
			if (r.status === 200) return r.data
			else return []
		})
}