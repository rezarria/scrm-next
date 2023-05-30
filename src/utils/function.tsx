import axios from 'axios'
import FriendInfo from '@/model/FriendInfo'

export function getFriends () {
	return axios.get<FriendInfo[]>('http://localhost:8080/api/user/friend/list')
		.then(r => {
			if (r.status === 200) return r.data
			else return []
		})
}


export function deleteAllCookies () {
	const cookies = document.cookie.split(';')

	for (const element of cookies) {
		const cookie = element
		const eqPos = cookie.indexOf('=')
		const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
		document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
	}
}