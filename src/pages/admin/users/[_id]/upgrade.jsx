import axios from "axios";
import Link from "next/link";

import { AuthServerSide } from "@/lib/app2";
import { useRouter } from "next/router";
import { message } from "antd";
import { useForm } from "react-hook-form";

export async function getServerSideProps(ctx) {
    return await AuthServerSide(ctx, 'admin', async ({ NEXT_PUBLIC_API, config }) => {
        let url = `${NEXT_PUBLIC_API}/users/${ctx.query._id}`
        let { data } = await axios.get(url, config);
        return { data, config }
    })
}

export default function EditUser({ data }) {
    const { register, handleSubmit } = useForm();
    let { push, query } = useRouter()

    const onSubmit = data => {
        let body = []
        Object.keys(data)
            .map(a => data[a] ? body.push(a) : null)
        axios.post(`/api//users/${query._id}`, body)
            .then(({ data }) => {
                message.success(data.msg)
                push("/admin/users")

            })
    }
    // add typeUser in table
    return (
        <form className="box col bord pup w-300 p-20 center" onSubmit={handleSubmit(onSubmit)}>
            <h1>تحديث الصلاحيات </h1>
            <p className="p-10">{data?.fullname} </p>
            <div className="box row m-10">
                <input type="checkbox" id="admin" {...register("admin")} />
                <label htmlFor="admin" className="px-10">الادمن</label>
            </div>
            <div className="box row m-10">
                <input type="checkbox" id="teacher" {...register("teacher")} />
                <label htmlFor="teacher" className="px-10">معلمة</label>

            </div>
            <div className="aitem box mt-20 row w-full">
                <Link href={"/admin/users"} className=" btn off w-full" style={{ marginLeft: '10px' }}  >عودة </Link>
                <input type="submit" className=" w-full " />
            </div>
        </form>
    )
}