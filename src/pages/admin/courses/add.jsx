import axios from "axios";
import Link from "next/link";

import { AuthServerSide } from "@/lib/app2";
import { useState } from "react";
import { useRouter } from "next/router";
import { message } from "antd";
import { Input } from "@/lib/app";

export async function getServerSideProps(ctx) {
    return await AuthServerSide(ctx, 'admin', async ({ NEXT_PUBLIC_API, config }) => {
        return { config }
    })
}
export default function CreateChild({ config }) {
    let [Data, setData] = useState({})
    let set = e => setChange(e, Data, setData)
    let { query, push } = useRouter()
    function send() {
        // this the code
        let body = { user_id: query._id, ...Data }
        // send data
        axios.post("/api/courses", body, config)
            .then(({ data }) => {
                message.success(data.msg)

                push("/admin/courses")
            })
    }

    return (
        <div className='bord box col p-20 center ' style={{ maxWidth: '500px' }} onChange={set}>
            <h1 className="center box my-20">اضافة دورة تدريبية </h1>
            <Input title="عنوان الدورة " name="title" />
            <Input title="وصف الدورة" name="description" />
            <Input title="الرابط الدائم" name="url" />
            <Input title="الصورة التعريفية" name="image" type="file" />

            {/* <h2>التوقيت</h2> */}
            {/* <div className="box col space"> */}
                {/* <Input title="البداية " name="start" object="date" type="date" /> */}
                {/* <Input title="الوقت الكلي" name="total" object="date" type="date" /> */}
                {/* <Input title="نهاية الدورة" name="end" object="date" type="date" /> */}
            {/* </div> */}
            {/* <div className="box row space"> */}
                {/* <Input title="النقاط" name="coin" object="count" style={{ width: "120px" }} /> */}
                {/* <Input title="عدد الجلسات" name="session" object="count" style={{ width: "120px" }} /> */}
            {/* </div> */}





            <div className="mt-20 w-full box row">
                <Link href={"/admin/courses"} className="p-10 w-full btn off"  >الغاء </Link>
                <button onClick={send} className="mr-10 w-full"> اضافة</button>
            </div>
        </div>
    )
}
