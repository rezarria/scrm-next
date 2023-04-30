import Image from "next/image";

export interface MenuSideProps {
    items?: { icon: string, title: string, onClick?: Function }[]
}

export default function MenuSide(props: MenuSideProps) {
    return <ul className='bg-white rounded-r w-fit h-full'>
        {props.items && props.items.map((n, i) => <li key={i}>
            <div>
                <Image src={n.icon} width='15' height='15' alt='icon'/>
            </div>
        </li>)}
    </ul>
}