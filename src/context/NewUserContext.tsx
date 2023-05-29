import Chat from '@/model/Chat'
import axios from 'axios'

class Context {

	private readonly cache: Map<string, Chat>
	private readonly apiEndpoint: string
	private readonly queue: Map<string, Promise<Chat | Chat[]>>
	private readonly locks: Map<string, Lock>

	constructor () {
		this.cache = new Map<string, Chat>()
		this.queue = new Map<string, Promise<Chat | Chat[]>>
		this.apiEndpoint = 'http://localhost:8080/api/user/info'
		this.locks = new Map<string, Lock>()
	}

	async get (id: string): Promise<Chat | Chat[] | undefined> {
		if (this.cache.has(id)) {
			return Promise.resolve(this.cache.get(id))
		} else if (this.queue.has(id)) {
			return this.queue.get(id)
		} else {

			if (!this.locks.has(id))
				this.locks.set(id, new Lock())

			const lock = this.locks.get(id) as Lock
			await lock.acquire()
			try {
				if (this.cache.has(id)) {
					return Promise.resolve(this.cache.get(id))
				} else if (this.queue.has(id)) {
					return await this.queue.get(id)
				} else {
					const promise = this.fetchDataFromApi(id)
					this.queue.set(id, promise)
					const data = await promise
					this.queue.delete(id)
					this.cache.set(id, data)
					return data
				}
			} finally {
				lock.release()
			}
		}
	}

	async getMany (idList: string[]): Promise<Chat[] | undefined> {
		let foundId: string[] = Array.from(this.cache.keys()).filter(i => idList.includes(i))
		let missingIdList = idList.filter(id => !foundId.includes(id))
		if (missingIdList.length === 0) {
			return Promise.resolve(Array.from(this.cache.values()).filter(id => foundId.includes(id.id)))
		} else if (Array.from(this.queue.keys()).every(id => missingIdList.includes(id))) {
			let queueIdList = Array.from(this.queue.keys()).filter(i => missingIdList.includes(i))
			let queueList = queueIdList.map(id => this.queue.get(id))
			return Promise.all(queueList).then(result => {
				let chatList = result.filter(id => typeof id === 'object') as Chat[]
				let chat2D = result.filter(id => Array.isArray(id)) as Chat[][]
				let foundList = foundId.map(id => this.cache.get(id) as Chat)
				return [...chatList, ...chat2D.flat(), ...foundList]
			})
		} else {
			missingIdList.forEach(id => {
				if (!this.locks.has(id))
					this.locks.set(id, new Lock())
			})
			const locks = missingIdList.map(id => this.locks.get(id) as Lock)
			await Promise.all(locks.map(id => id.acquire()))
			try {
				foundId = idList.filter(id => this.cache.has(id))
				let foundList = foundId.map(id => this.cache.get(id) as Chat)
				missingIdList = idList.filter(id => !foundId.includes(id))
				let promiseId = missingIdList.filter(id => this.queue.has(id))
				missingIdList = missingIdList.filter(id => promiseId.includes(id))
				let promiseList = promiseId.map(id => this.queue.get(id) as Promise<Chat[] | Chat>)
				const promise = this.fetchManyDataFromApi(missingIdList)
				missingIdList.forEach(id => {
					this.queue.set(id, promise)
				})
				let missingData = await promise
				missingIdList.forEach(id => this.queue.delete(id))
				missingData.forEach(data => this.cache.set(data.id, data))
				return Promise.all(promiseList).then(reuslt => {
					let chatList = reuslt.filter(i => typeof i === 'object') as Chat[]
					let chat2D = reuslt.filter(i => Array.isArray(i)) as Chat[][]
					return [...chatList, ...chat2D.flat(), ...foundList, ...missingData]
				})
			} finally {
				locks.forEach(lock => lock.release())
			}
		}
	}

	fetchDataFromApi (id: string) {
		return axios.get<Chat>(this.apiEndpoint, {params: {id}}).then(r => r.data)
	}

	fetchManyDataFromApi (id: string[]): Promise<Chat[]> {
		return axios.post<Chat[]>(this.apiEndpoint, {params: {id}}).then(r => r.data)
	}
}

class Lock {

	private _locked: boolean
	private _waiters: ((value: (void | PromiseLike<void>)) => void)[]

	constructor () {
		this._locked = false
		this._waiters = []
	}

	acquire (): Promise<void> | Promise<unknown> {
		if (!this._locked) {
			this._locked = true
			return Promise.resolve()
		} else {
			return new Promise<void>(resolve => this._waiters.push(resolve))
		}
	}

	release () {
		if (this._waiters.length > 0) {
			const next = this._waiters.shift()
			next?.()
		} else {
			this._locked = false
		}
	}
}