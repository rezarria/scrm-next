export default interface ChatMessage {
	id: string
	chat: string
	replyMessage: string
	pictures: string[]
	videos: string[]
	details: string[]
	content: string
	lastModifiedDate:string
	createBy: string
}