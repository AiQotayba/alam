"use client"
import { Input, setChange } from "@/lib/app"
import { message } from "antd"
import axios from "axios"
import Cookies from "js-cookie"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"

export async function getServerSideProps(ctx) {
    let { token } = ctx.req.cookies

    if (token && token.length > 20) return { redirect: { permanent: false, destination: '/' } }
    else return { props: {} }
}
export default function Signup() {
    let [Data, setData] = useState({})
    let set = e => setChange(e, Data, setData)
    let route = useRouter()

    function send(e) {
        e.preventDefault()
        // send data to the server
        axios.post('/api/auth', Data)
            .then(async ({ data }) => {
                // alert
                if (data.token) {
                    message.success("تم التسجيل  ")
                    // set token in cookie
                    Cookies.set('token', data.token)
                    // redirect to home user page
                    location.replace("/")

                } else if (data.error) message.error(data.error);



            })
    }
    return (
        <div>
            <form >
                <h1>التسجيل</h1>
                <Input title="الاسم الكامل" name='fullname' onChange={set} />
                <Input title="الايميل" type="email" name='email' onChange={set} />
                <Input title="رقم الهاتف" name='phone' onChange={set} />
                <Input title="كلمة السر" type="password" name='password' onChange={set} />
                <button onClick={send} className="mt-20">تسجيل</button>
                <hr />
                <div >
                    <span>اذا كان لديك حساب بامكانك </span>
                    <Link href={"/auth/login"}>  تسجيل الدخول</Link>
                </div>
            </form>
        </div>
    )
}
