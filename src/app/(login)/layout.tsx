import '../globals.css'
import TopNavigator from "@/components/TopNavigator";
import SearchBar from "@/components/SearchBar";
import MenuSide from "@/components/MenuSide";

export const metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className={'bg-blue-400'}>
        {children}
        </body>
        </html>
    )
}
