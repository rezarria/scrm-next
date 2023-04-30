'use client'

import {ReactNode} from "react";

export interface TopNavigatorProps {
    leftChildren?: ReactNode
    centerChildren?: ReactNode
    rightChildren?: ReactNode
}

export default function TopNavigator(props: TopNavigatorProps) {
    return (
        <nav className='flex flex-row border-b py-1 bg-white fixed w-screen top-0 h-10'>
            <div className='flex-1 left'>{props.leftChildren}</div>
            <div className='flex-1 flex flex-row justify-center center'>{props.centerChildren}</div>
            <div className='flex-1 right'>{props.rightChildren}</div>
        </nav>
    )
}