import axios from "axios";
import Link from "next/link";
import { useForm } from "react-hook-form";

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
export default function EditUser({ data: propsD, config }) {
    let [Data, setData] = useState(propsD)
    const { register, handleSubmit } = useForm();
    let { push, query } = useRouter()
    const onSubmit = data => {
        // this the code
        // send data
        let url = `${process.env.NEXT_PUBLIC_API}/users/${query._id}`
        axios.put(url, data, config)
            .then(({ data }) => {
                message.success(data.msg)
                push("/admin/users")
            })
    }

    return (
        <form className="box col bord pup w-300 p-20 center" onSubmit={handleSubmit(onSubmit)}>
            <h1>تعديل المستخدم  </h1>
            <label htmlFor="fullname" className="px-10">الاسم الكامل</label>
            <input type="text" id="fullname" {...register("fullname")} defaultValue={Data?.fullname} />

            <label htmlFor="email" className="px-10">الايميل  </label>
            <input type="email" id="email" {...register("email")} defaultValue={Data?.email} />

            <label htmlFor="phone" className="px-10">الهاتف  </label>
            <input type="text" id="phone" {...register("phone")} defaultValue={Data?.phone} />

            <div className="mt-20 w-full box row">
                <Link href={"/admin/users"} className="ml-10 btn p-10 w-full m-0 off"  >عودة </Link>
                <input type="submit" className=" w-full " />
            </div>
        </form>
    )
}