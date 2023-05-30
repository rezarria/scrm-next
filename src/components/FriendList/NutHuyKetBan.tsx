import axios from 'axios'

export default function NutHuyKetBan (props: { id: string, onDelete?: Function }) {
	return (
		<button
			onClick={() => {
				axios.delete('http://localhost:8080/api/user/friend/remove', {params: {id: props.id}})
					.then(r => {
						if (r.status === 200) {
							props.onDelete?.()
						}
					})
					.catch(r => {
					})
			}}
			className='rounded hover:bg-white h-fit p-2 hover:text-blue-500 group-hover:font-bold duration-300 hover:duration-200'>Xoá
			bạn
		</button>
	)
}