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
        let { data } = await axios.get(url);
        return { props: { data, config } }
    })
}

export default function EditChild({ data: propsData, config }) {
    const { register, handleSubmit } = useForm();

    let [data, setData] = useState(propsData)
    let { query, push } = useRouter()

    const onSubmit = res => {
        let body = {
            count: {
                coin: 50,
                session: 10,
                students: 0
            },
            title: res.title,
            description: res.description,
            url: res.url,
        }
        const file = res.image//.files[0];
        if (file.length > 0) {
            const reader = new FileReader();
            reader.onloadend = () => body["image"] = reader.result
            reader.readAsDataURL(file[0]);
        } else body["image"] = data?.image

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
            <input  {...register("title")} defaultValue={data?.title} />


            <p>وصف الدورة</p>
            <input {...register("description")} defaultValue={data?.description} />
            <p>الرابط الدائم</p>
            <input {...register("url")} defaultValue={data?.url} />
            <p>الصورة التعريفية</p>
            <input {...register("image")} type="file" />

            {/* <h2>التوقيت</h2> */}
            {/* <div className="box col space" defaultValue={data}> */}
            {/* <Input title="البداية " name="start" object="date" type="date" defaultValue={data?.date?.start} /> */}
            {/* <Input title="الوقت الكلي" name="total" object="date" type="date" defaultValue={data?.date?.total} /> */}
            {/* <Input title="نهاية الدورة" name="end" object="date" type="date" defaultValue={data?.date?.end} /> */}
            {/* </div> */}
            {/* <div className="box row space"> */}
            {/* <Input title="النقاط" name="coin" object="count" style={{ width: "120px" }} defaultValue={data?.count?.coin} /> */}
            {/* <Input title="عدد الجلسات" name="session" object="count" style={{ width: "120px" }} defaultValue={data?.count?.session} /> */}
            {/* </div> */}
            <div className="mt-20 w-full box row">
                <Link href={`/admin/courses/${query._id}`} className="p-10 w-full btn off"  >الغاء </Link>
                <input type='submit' className="mr-10 w-full" />
            </div>
        </form>
    )
}
