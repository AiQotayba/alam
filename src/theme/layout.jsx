import Image from 'next/image'
import Link from 'next/link'

export default function Layout({ children }) {

    return (
        <>
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
    function CastemLink({ title, href, src }) {
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
    return (
        <nav >
            <div className='box row aitem'>

                {/* menu icon */}
                <Image src="/icons/menu.svg" alt="icon " height={50} width={50} className="mr-10" onClick={open} />

                {/* logo */}
                <Link href={'/'} className='logo'>
                    <Image src="/images/logo.png" alt="logo " height={48} width={128} />
                </Link>
            </div>

            <div className="  menu  " onClick={open}  >
                {/* <Link href={"/admin/users"}>المستخدمين</Link> */}
                {/* <Link href={"/admin/courses"}>الكورسات</Link> */}

                <CastemLink title={"الادارة"} href={"/admin"} src="/icons/dashboard.svg" />
                <CastemLink title={"المعلمة"} href={"/teacher"} src="/icons/teacher.svg" />
                <CastemLink title={"الاهل"} href={"/family"} src="/icons/family.webp" />

                {/* menu */}
            </div>
            {/* links  */}
            <Link href={'/setting/profile'} className='logo'>
                <Image src="/icons/user.svg" alt="logo " height={40} width={40} />
            </Link>
        </nav>
    )
}
