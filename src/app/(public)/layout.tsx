import '../globals.css'
import {ReactNode} from "react";

export const metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
}

export default function PublicLayout({
                                         children,
                                     }: {
    children: ReactNode
}) {
    return (
        <html>
        <body>{children}</body>
        </html>
    )
}
