'use client'

import TopNavigator from "@/components/TopNavigator";
import SearchBar from "@/components/SearchBar";
import MenuSide, {MenuSideProps} from "@/components/MenuSide";
import {ReactNode, useContext} from "react";
import UserInfoContext from "@/context/userInfoContext";
import PrivateRoute from "@/router/PrivateRoute";

export default function RootLayout({
                                       children,
                                   }: {
    children: ReactNode
}) {
    return (
        <PrivateRoute>
            <UserInfoContext.Provider value={null}>
                <div className='bg-blue-400 h-screen relative'>
                    <TopNavigator centerChildren={<SearchBar/>}/>
                    <div className='flex h-full pt-10'>
                        <Left/>
                        <Center/>
                        <Right/>
                    </div>
                    {children}
                </div>
            </UserInfoContext.Provider>
        </PrivateRoute>
    )
}

function Left() {
    const userInfo = useContext(UserInfoContext)

    const props: MenuSideProps = {
        items: []
    }

    if (userInfo !== null) {
        props.items?.push({
            icon: userInfo.avatar,
            title: userInfo.fullname
        })
    }

    return <div className='flex-1'>
        <MenuSide items={[{
            title: 'a',
            icon: ''
        }]}/>
    </div>
}

function Center() {
    return <div className='flex-1'></div>
}

function Right() {
    return <div className='flex-1'></div>
}