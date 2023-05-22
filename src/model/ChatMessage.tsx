export default interface ChatMessage {
	id: string
	chat: string
	replyMessage: string
	pictures: string[]
	videos: string[]
	details: string[]
	content: string
	createDate: string
	createBy: string
}