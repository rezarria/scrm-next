export default function ChatSessionContent () {
	return (
		<div className='overflow-hidden'>
			{
				Array.from(Array(100).keys()).map(t => <div key={t}>Brub</div>)
			}
		</div>
	)
}