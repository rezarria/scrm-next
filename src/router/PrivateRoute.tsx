'use client'

import {ReactNode, useEffect, useState} from "react";
import {useRouter as userRouterNavigation} from "next/navigation";
import axios from "axios";
import UserInfoContext from "@/context/userInfoContext";
import UserInfo from "@/model/UserInfo";
import {useRouter} from "next/router";

export interface Response {
    lastUpdate: string
    token: string
    user: UserInfo
}

enum Status {
    LOADING, DONE, ERROR
}

export default function PrivateRoute({children}: { children?: ReactNode }) {
    const [status, setStatus] = useState<Status>(Status.LOADING)
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
    const navigation = userRouterNavigation()
    const router = useRouter()

    let jwtStr = localStorage.getItem('jwt')
    if (jwtStr === null) navigation.push(`/login?returnUrl=${router.pathname}`)

    useEffect(() => {
        if (jwtStr !== null) {
            let lastUpdate = localStorage.getItem('last update')
            if (lastUpdate === null) lastUpdate = new Date().toISOString()
            axios.post<Response>('http://localhost:8080/api/user/lastUpdate', {lastUpdate})
                .then(r => {
                    if (r.status === 200) {
                        setStatus(Status.DONE)
                        localStorage.setItem('last update', r.data.lastUpdate)
                        localStorage.setItem('jwt', r.data.token)
                        localStorage.setItem('user info', JSON.stringify(r.data.user))
                        setUserInfo(r.data.user)
                    }
                })
                .catch(_ => {
                    setStatus(Status.ERROR)
                })
        }
    }, [jwtStr])

    switch (status) {
        case Status.LOADING:
            return <>Đăng kiểm tra thông tin đăng nhập...</>
        case Status.DONE:
            return <>
                <UserInfoContext.Provider value={userInfo}>
                    {children}
                </UserInfoContext.Provider>
            </>
        case Status.ERROR:
            return <>SOMETHING WRONG...</>
    }
}