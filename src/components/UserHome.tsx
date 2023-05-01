import UserInfo from '@/model/UserInfo';
import Image from 'next/image';

interface UserHomeProps {
	userInfo: UserInfo,
	background?: string
}

export default function UserHome(props: UserHomeProps) {
	return <div>
		<div className=''>
			{props.background && <></>}
		</div>
		<div className=''>
			<div className=''>
				{props.userInfo.avatar && <Image src={props.userInfo.avatar} alt='avatar'/>}
			</div>
			<div className=''>{props.userInfo.fullName}</div>
		</div>
	</div>
}