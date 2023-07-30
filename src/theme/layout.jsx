import Cookies from 'js-cookie'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Layout({ children }) {

    return (
        <>
            <Head>
                <title>عالم المبدعين</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Marhey:wght@300&display=swap" rel="stylesheet" />
            </Head>
            <Nav />
            <section >
                {children}
            </section>
        </>
    )
}
export function openMenu() {
    document.querySelector(".menu")?.classList.toggle('menu-delay')
}
export function Nav() {
    let [menu, set] = useState([])
    useEffect(() => {

        let res = Cookies.get("typeUser")
        if (res) set(JSON.parse(res))
    }, [])
    function CL({ title, href, src }) {
        return (
            <Link href={href} className='box row aitem px-10' >
                <Image src={src} alt="icon " height={30} width={30} />
                <p className="px-10"> {title}</p>
            </Link>
        )
    }
    function open() {
        document.querySelector('nav .menu').classList.toggle("menu-delay")

    }
    let List = {
        admin: { title: "الادارة", href: "/admin", src: "/icons/dashboard.svg" },
        teacher: { title: "المعلمة", href: "/teacher", src: "/icons/teacher.svg" },
        family: { title: "الاهل", href: "/family", src: "/icons/family.webp" },
    }
    return (
        <nav >
            <div className='box row aitem'>

                {/* menu icon */}
                <Image src="/icons/menu.svg" alt="icon " height={50} width={50} className="mr-10 menu-btn" onClick={open} />

                {/* logo */}
                <Link href={'/'} className='logo'>
                    <Image src="/images/logo.png" alt="logo " height={48} width={128} />
                </Link>
            </div>

            <div className="  menu  " onClick={open}  >
                <CL title={"الرئيسية"} href={"/"} src={"/icons/home-ui.svg"} />
                {menu.map(a => <CL title={List[a].title} href={List[a].href} src={List[a].src} key={a} />)}
                {/* menu */}
            </div>
            {/* links  */}
            <Link href={'/setting/profile'} className='logo'>
                <Image src="/icons/user.svg" alt="logo " height={40} width={40} />
            </Link>
        </nav>
    )
}
