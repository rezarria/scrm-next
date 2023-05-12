export default interface FriendRequest {
	id: string
	from: string
	to: string
	status: keyof typeof Status
	createDate: string
}

export enum Status {
	YES, NO, NONE
}