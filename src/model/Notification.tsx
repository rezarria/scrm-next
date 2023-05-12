export default interface Notification {
	id: string
	user: string
	content: string
	icon: string
	iconLink: string
	relId: string
	mode: keyof typeof Mode
	status: keyof typeof Staus
	lastModifiedDate: string
}

export enum Mode {
	FriendRequest, NewPost, ReplyComment
}

export enum Staus {
	UNSEEN, SEEN
}