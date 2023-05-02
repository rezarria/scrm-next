import HomeIcon from '@mui/icons-material/Home'
import {useRouter} from 'next/navigation';

export default function GoMain() {
	const router = useRouter()
	return <div className='flex flex-row items-center h-full ps-6'>
		<div className='relative w-7 h-7 text-[30px] leading-[0] cursor-pointer' onClick={() => {
			router.push('/')
		}}>
			<HomeIcon fontSize={'inherit'}/>
		</div>
	</div>
}