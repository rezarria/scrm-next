import {memo} from 'react'
import Image from 'next/image'

interface UserInfoProps {
	name?: string | null;
	avatar?: string | null;
}

function UserInfo (props: UserInfoProps) {
	return <div>
		<div>
			{props.avatar && <Image src={props.avatar} width='200' height='200' alt='avatar'/>}
		</div>
		<div>{props.name}</div>
	</div>
}

export default memo(UserInfo)
