'use client'

import styles from './styles.module.scss'
import React, {useState} from "react";
import PersonIcon from '@mui/icons-material/Person';
import PasswordIcon from '@mui/icons-material/Password';
import background from './bg-login.jpg';

interface Props {
}

export default function Page(props: Props) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    return (
        <div className={styles['main-panel']} style={{backgroundImage: `url(${background.src})`}}>
            <div className={styles['login-panel']}>
                <div className={styles['body-login-panel']}>
                    <div className={styles['group-input']}>
                        <label><PersonIcon color='info'/></label>
                        <input type='text' onClick={e => {
                            setUsername((e.target as HTMLInputElement).value)
                        }}/>
                    </div>
                    <div className={styles['group-input']}>
                        <label><PasswordIcon color='info'/></label>
                        <input type='password' onClick={e => {
                            setPassword((e.target as HTMLInputElement).value)
                        }}/>
                    </div>
                    <button type='button' className={styles['login-button']}>LOGIN</button>
                </div>
            </div>
        </div>
    )
}