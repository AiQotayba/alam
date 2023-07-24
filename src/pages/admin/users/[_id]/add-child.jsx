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
export default function CreateChild({ config }) {
    let [Data, setData] = useState({})
    let set = e => setChange(e, Data, setData)
    let { query, push } = useRouter()
    function send(e) {
        e.preventDefault()
         // this the code
        let body = { user_id: query._id, ...Data }
        console.log(body);
        // send data
        axios.post("/api/child", body, config)
            .then(({ data }) => {
                message.success(data.msg)
                push(`/admin/users/${query._id}/childs`)
            })
    }
    return (
        <form className='bord pup w-300 p-20 center ' onChange={set} >
            <h1>اضافة طفل/ة</h1>
            <Input title="الاسم" name="name" />
            <Input title="العمر" name="age" />
            <div className="mt-20 w-full box row">
                <Link href={"/admin/users"} className="p-10 w-full m-0 btn off"  >الغاء </Link>
                <button onClick={send} className="mr-10 w-full"> اضافة</button>
            </div>
        </form>
    )
}
