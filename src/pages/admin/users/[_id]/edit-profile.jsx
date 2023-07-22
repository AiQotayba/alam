import axios from "axios";
import Link from "next/link";

import { AuthServerSide } from "@/lib/app2";
import { useState } from "react";
import { Input, setChange } from "@/lib/app";
import { useRouter } from "next/router";
import { message } from "antd";

export async function getServerSideProps(ctx) {
    return await AuthServerSide(ctx, 'admin', async ({ NEXT_PUBLIC_API, config }) => {
        let url = `${NEXT_PUBLIC_API}/users/${ctx.query._id}`
        let { data } = await axios.get(url, config);
        return { data, config }
    })
}
export default function EditUser({ data }) {
    let [Data, setData] = useState(data)
    let set = e => setChange(e, Data, setData)
    let { push } = useRouter()

    function send() {
        // this the code
        let body = { user_id: data._id, ...Data }
        // send data
        let url = `${process.env.NEXT_PUBLIC_API}/users/${data._id}`
        axios.put(url, body)
            .then(({ data }) => {
                message.success(data.msg)
                push("/admin/users")
            })
    }

    return (
        <from className="bord pup w-300 p-20 center" onChange={set}>
            <h1>تعديل المستخدم  </h1>
            <Input title="الاسم الكامل" name="fullname" defaultValue={Data?.fullname} />
            <Input title="الايميل" name="email" type="email" defaultValue={Data?.email} />
            <Input title="الهاتف" name="phone" defaultValue={Data?.phone} />

            <div className="mt-20 w-full box row">
                <Link href={"/admin/users"} className=" btn p-10 w-full off"  >عودة </Link>
                <button onClick={send} className="mr-10 w-full"> تحديث</button>
            </div>
        </from>
    )
}