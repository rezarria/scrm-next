import axios from 'axios'


interface ContextInterface<T> {
	get: (id: string) => Promise<T | undefined>
	getMany: (idList: string[]) => Promise<T[] | undefined>
	getAll: ()=>T[]
}

export default function createNewContext<T> () {

	const cache: Map<string, T> = new Map<string, T>()
	const apiEndpoint: string = 'http://localhost:8080/api/user/info'
	const queue: Map<string, Promise<T | T[]>> = new Map<string, Promise<T | T[]>>
	const locks: Map<string, LockInterface> = new Map<string, LockInterface>()

	return {
		getAll: ()=> Array.from(cache.values()),
		async get (id: string): Promise<T | undefined> {
			if (cache.has(id)) {
				return Promise.resolve(cache.get(id))
			} else if (queue.has(id)) {
				return queue.get(id)!.then(d => {
					if (typeof d === 'object') return d as T
					else { // @ts-ignore
						return (d as T[]).find(i => i.id === id) as T
					}
				})
			} else {

				if (!locks.has(id))
					locks.set(id, createLock())

				const lock = locks.get(id) as LockInterface
				await lock.acquire()
				try {
					if (cache.has(id)) {
						return Promise.resolve(cache.get(id))
					} else if (queue.has(id)) {
						return await queue.get(id)!.then(d => {
							if (typeof d === 'object') return d as T
							else { // @ts-ignore
								return (d as T[]).find(i => i.id === id) as T
							}
						})
					} else {
						const promise = fetchDataFromApi<T>(id, apiEndpoint)
						queue.set(id, promise)
						const data = await promise
						queue.delete(id)
						cache.set(id, data)
						return data
					}
				} finally {
					lock.release()
				}
			}
		},
		async getMany (idList: string[]): Promise<T[] | undefined> {
			let foundId: string[] = Array.from(cache.keys()).filter(i => idList.includes(i))
			let missingIdList = idList.filter(id => !foundId.includes(id))
			if (missingIdList.length === 0) {
				// @ts-ignore
				return Promise.resolve(Array.from(cache.values()).filter(id => foundId.includes(id.id)))
			} else if (missingIdList.every(i=>queue.has(i))) {
				let queueIdList = Array.from(queue.keys()).filter(i => missingIdList.includes(i))
				let queueList = queueIdList.map(id => queue.get(id))
				return Promise.all(queueList).then(result => {
					let chatList = result.filter(data => typeof data === 'object') as T[]
					let chat2D = result.filter(data => Array.isArray(data)) as T[][]
					let foundList = foundId.map(data => cache.get(data) as T)
					return [...chatList, ...chat2D.flat(), ...foundList]
				})
			} else {
				missingIdList.forEach(id => {
					if (!locks.has(id))
						locks.set(id, createLock())
				})
				const lockList = missingIdList.map(id => locks.get(id) as LockInterface)
				await Promise.all(lockList.map(id => id.acquire()))
				try {
					foundId = idList.filter(id => cache.has(id))
					let foundList = foundId.map(id => cache.get(id) as T)
					missingIdList = idList.filter(id => !foundId.includes(id))
					let promiseId = missingIdList.filter(id => queue.has(id))
					missingIdList = missingIdList.filter(id => !promiseId.includes(id))
					let promiseList = promiseId.map(id => queue.get(id) as Promise<T[] | T>)
					const promise = fetchManyDataFromApi<T>(missingIdList, apiEndpoint)
					missingIdList.forEach(id => {
						queue.set(id, promise)
					})
					let missingData = await promise
					missingIdList.forEach(id => queue.delete(id))
					// @ts-ignore
					missingData.forEach(data => cache.set(data.id, data))
					return Promise.all(promiseList).then(reuslt => {
						let chatList = reuslt.filter(i => typeof i === 'object') as T[]
						let chat2D = reuslt.filter(i => Array.isArray(i)) as T[][]
						return [...chatList, ...chat2D.flat(), ...foundList, ...missingData]
					})
				} finally {
					locks.forEach(lock => lock.release())
				}
			}
		}
	}


}

function fetchDataFromApi<T> (id: string, apiEndpoint: string) {
	return axios.get<T>(apiEndpoint, {params: {id}}).then(r => r.data)
}

function fetchManyDataFromApi<T> (id: string[], apiEndpoint: string): Promise<T[]> {
	return axios.post<T[]>(apiEndpoint, {id}).then(r => r.data)
}

interface LockInterface {
	acquire: () => Promise<void> | Promise<unknown>
	release: () => void
}

function createLock (): LockInterface {

	let _locked: boolean = false
	const _waiters: ((value: (void | PromiseLike<void>)) => void)[] = []

	return {
		acquire: (): Promise<void> | Promise<unknown> => {
			if (!_locked) {
				_locked = true
				return Promise.resolve()
			} else {
				return new Promise<void>(resolve => _waiters.push(resolve))
			}
		},
		release: () => {
			if (_waiters.length > 0) {
				const next = _waiters.shift()
				next?.()
			} else {
				_locked = false
			}
		}
	}
}