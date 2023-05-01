import axios from 'axios';

interface PageProps {
	params: {
		id: string
	}
}

export default async function Page(props: PageProps) {

	let userInfo = await axios.get(`http://localhost:8080/api/user/info?id=${props.params.id}`)

	return <>
		a
	</>
}