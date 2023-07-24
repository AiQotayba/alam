import axios from "axios";
import Link from "next/link";

import { AuthServerSide } from "@/lib/app2";
import { useState } from "react";
import { Input, setChange } from "@/lib/app";
import { useRouter } from "next/router";
import { message } from "antd";

export async function getServerSideProps(ctx) {
    return await AuthServerSide(ctx, 'admin', async ({ NEXT_PUBLIC_API, config }) => {
        return { config }
    })
}
export default function NewPassword({ config }) {
    let [Data, setData] = useState({})
    let set = e => setChange(e, Data, setData)
    let { query, push } = useRouter()
    function send() {
        // this the code
        let body = { ...Data }
        // send data
        let url = `${process.env.NEXT_PUBLIC_API}/users/${query._id}`
        axios.patch(url, body, config)
            .then(({ data }) => {
                message.success(data.msg)
                push("/admin/users")
            })
    }
    return (
        <form onChange={set} className="bord pup w-300 p-20 center" >
            <h1>تحديث كلمة السر  </h1>
            <Input title="كلمة السر" name="password" />
            <div className="mt-20 w-full box row">
                <Link href={"/admin/users"} className=" btn p-10 m-0 w-full off"  >عودة </Link>
                <button onClick={send} className="mr-10 w-full"> تحديث</button>
            </div>
        </form>
    )

}
