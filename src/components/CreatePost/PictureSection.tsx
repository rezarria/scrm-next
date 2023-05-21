import PictureItem from '@/components/CreatePost/PictureItem'
import { ForwardedRef, forwardRef, useImperativeHandle, useState } from 'react'

export type Props = {}

export type PictureSectionRef = {
	add: (n: string) => void
	remove: (n: string) => void
	get: () => string[]
}

const PictureSection = forwardRef(PictureSectionComponent)

function PictureSectionComponent (props: Props, ref: ForwardedRef<PictureSectionRef>) {
	const [list, setList] = useState<string[]>([])
	const dong = (n: string) => () => setList(list.filter(i => i != n))

	useImperativeHandle(ref, (): PictureSectionRef => ({
		add: (n: string) => setList([...list, n]),
		remove: (n: string) => setList(list.filter(i => i !== n)),
		get: () => list
	}), [])

	return (
		<div className='flex flex-row gap-1 border-t-2 pt-2'>
			{list.map(src => <PictureItem key={src} src={src} onClose={dong(src)}/>)}
		</div>
	)
}

export default PictureSection