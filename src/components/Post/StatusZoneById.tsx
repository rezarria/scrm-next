import StatusZone from '@/components/Post/StatusZone'
import StatusInfo from '@/components/Post/StatusInfo'
import FavoriteIcon from '@mui/icons-material/Favorite'

interface StatusZoneByIdProps {
	id: string
}

export default function StatusZoneById (props: StatusZoneByIdProps) {
	return <StatusZone>
		<StatusInfo icon={<FavoriteIcon htmlColor='white' className='group-hover:text-blue-500'/>} count={1000}/>
		<StatusInfo icon={<FavoriteIcon htmlColor='white' className='group-hover:text-blue-500'/>} count={1000}/>
		<StatusInfo icon={<FavoriteIcon htmlColor='white' className='group-hover:text-blue-500'/>} count={1000}/>
	</StatusZone>
}