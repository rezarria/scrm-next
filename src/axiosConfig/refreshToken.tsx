import axios from 'axios';

interface RefreshResponse {
	jwtToken: string,
	refreshToken: string
}

const refreshToken = async (): Promise<RefreshResponse> => {
	let refreshToken = localStorage.getItem('refresh token')
	return axios.post<RefreshResponse>('http://localhost:8080/api/account/refresh', {refreshToken})
		.then(res => {
			if (res.status === 200) {
				localStorage.setItem('refresh token', res.data.refreshToken)
				localStorage.setItem('jwt token', res.data.jwtToken)
				return res.data
			} else throw 'error'
		})
		.catch((error) => {
			if (axios.isAxiosError(error))
				throw new Error(`Failed to refresh access token: ${error.response ? error.response.data.message : error.message}`)
			throw error
		})
}

let task: Promise<RefreshResponse> | null = null

export default function setup() {
	axios.interceptors.request.use(
		async (res) => {
			if (task !== null) {
				let data = await task
				res.headers.setAuthorization('Bearer ' + data.jwtToken)
			}
			return res
		},
		(error) => {
			return Promise.reject(error)
		}
	)

	axios.interceptors.response.use(
		(response) => {
			return response;
		},
		async (error) => {
			const originalRequest = error.config;
			if (error.response.status === 401 && !originalRequest._retry) {
				if (task === null) {
					task = refreshToken()
					task.then(() => {
						task = null
					})
				}
				await task
				return axios(originalRequest);
			}
			return Promise.reject(error);
		}
	);
}