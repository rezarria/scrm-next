import {ReactNode} from "react";
import Image from "next/image";

interface MenuSideProps {
    items?: { icon: string, title: string, onClick?: Function }[]
}

export default function MenuSide(props: MenuSideProps) {
    return <ul className='bg-white rounded-r h-auto w-fit'>
        {props.items && props.items.map((n, i) => <li key={i}>
            <div>
                <Image src={n.icon} alt='icon'/>
            </div>
        </li>)}
    </ul>
}