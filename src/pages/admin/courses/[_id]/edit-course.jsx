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
    const { register, handleSubmit } = useForm();

    let [data, setData] = useState(propsData)
    let { query, push } = useRouter()

    const onSubmit = res => {
        let body = {
            title: res.title,
            description: res.description,
            price: res.price,
        }
        let path = `courses/${query._id}`
        function Send(data) {
            axios.put(`/api/${path}`, body, config)
                .then(({ data }) => {
                    message.success(data.msg)
                    push(`/admin/${path}`)
                })
        }
        const file = res.image//.files[0];
        if (file.length > 0) {
            const reader = new FileReader();
            reader.onloadend = () => Send({ ...body, image: reader.result })
            reader.readAsDataURL(file[0]);
        } else Send({ ...body, image: data?.image })
    }

    return (
        <form className='bord box col  w-300 p-20 center ' onSubmit={handleSubmit(onSubmit)}>
            <h1>تعديل دورة تدريبية </h1>
            <p>عنوان الدورة </p>
            <input  {...register("title")} defaultValue={data?.title} />

            <p>وصف الدورة</p>
            <textarea id="description" {...register("description")} className="h-200" defaultValue={data?.description} />

            <label htmlFor="price" > السعر  </label>
            <input type="number" id="price" {...register("price")} defaultValue={data?.price} />

            {/* <p>الصورة التعريفية</p> */}
            {/* <input {...register("image")} type="file" /> */}

            <div className="mt-20 w-full box row">
                <Link href={`/admin/courses/${query._id}`} className="p-10 w-full btn m-0 off"  >الغاء </Link>
                <input type='submit' className="mr-10 w-full" />
            </div>
        </form>
    )
}
