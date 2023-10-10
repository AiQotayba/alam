import axios from "axios";
import Link from "next/link";

import { AuthServerSide } from "@/lib/app2";
import { useState } from "react";
import { useRouter } from "next/router";
import { message } from "antd";
import { useForm } from "react-hook-form";

export async function getServerSideProps(ctx) {
    return await AuthServerSide(ctx, 'admin', async ({ NEXT_PUBLIC_API, config }) => {
        let url = `${NEXT_PUBLIC_API}/courses/${ctx.query._id}`
        let { data } = await axios.get(url, config);
        return { data, config }
    })
}

export default function EditChild({ data: propsData, config }) {

    let [data, setData] = useState(propsData)
    const { register, handleSubmit } = useForm({ defaultValues: data });
    let { query, push } = useRouter()

    const onSubmit = res => {
        let body = {
            title: res.title,
            description: res.description,
            price: res.price,
            duration: res.duration,
        }
        let path = `courses/${query._id}`
        axios.put(`/api/${path}`, body, config)
            .then(({ data }) => {
                message.success(data.msg)
                push(`/admin/${path}`)
            })
    }

    return (
        <form className='bord box col  w-300 p-20 center ' onSubmit={handleSubmit(onSubmit)}>
            <h1>تعديل دورة تدريبية </h1>
            <p>عنوان الدورة </p>
            <input  {...register("title")} />

            <p> المدة </p>
            <input  {...register("duration")} />

            <p>وصف الدورة</p>
            <textarea id="description" {...register("description")} className="h-200" />

            <label htmlFor="price" > السعر  </label>
            <input type="number" id="price" {...register("price")} />

            <div className="mt-20 w-full box row">
                <Link href={`/admin/courses/${query._id}`} className="p-10 w-full btn m-0 off"  >الغاء </Link>
                <input type='submit' className="mr-10 w-full" />
            </div>
        </form>
    )
}
