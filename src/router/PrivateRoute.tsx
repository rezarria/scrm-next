'use client'

import {ReactNode, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import axios from "axios";

export interface UserInfo {
    lastUpdate: string
    token: string
    user: {
        fullname: string,
        avatar: string
    }
}

enum Status {
    LOADING, DONE, ERROR
}

export default function PrivateRoute({children}: { children?: ReactNode }) {
    let route = useRouter()
    let [loading, setLoading] = useState(true)
    let jwt = localStorage.getItem('jwt')
    let [status, setStatus] = useState<Status>(Status.LOADING)

    if (jwt === null) route.push('/login')

    useEffect(() => {
        if (jwt !== null) {
            let lastUpdate = localStorage.getItem('last update')
            if (lastUpdate === null) lastUpdate = new Date().toISOString()
            axios.post<UserInfo>('http://localhost:8080/api/user/lastUpdate', {lastUpdate})
                .then(r => {
                    if (r.status === 200) {
                        setLoading(false)
                        localStorage.setItem('last update', r.data.lastUpdate)
                        localStorage.setItem('jwt', r.data.token)
                        localStorage.setItem('user info', JSON.stringify(r.data.user))
                    }
                })
                .catch(error => {
                })
        }
    }, [jwt])

    switch (status) {
        case Status.LOADING:
            return <>LOADING...</>
        case Status.DONE:
            return <>{children}</>
        case Status.ERROR:
            return <>SOMETHING WRONG...</>
    }
}