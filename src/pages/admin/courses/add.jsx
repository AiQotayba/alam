import axios from "axios";
import Link from "next/link";

import { AuthServerSide } from "@/lib/app2";
import { useState } from "react";
import { useRouter } from "next/router";
import { message } from "antd";
import { Input } from "@/lib/app";
import { useForm } from "react-hook-form";

export async function getServerSideProps(ctx) {
    return await AuthServerSide(ctx, 'admin', async ({ NEXT_PUBLIC_API, config }) => {
        return { config }
    })
}
export default function CreateChild({ config }) {
    let [Data, setData] = useState({})
    const { register, handleSubmit } = useForm();
    let set = e => setChange(e, Data, setData)
    let { query, push } = useRouter()
    const onSubmit = res => {
        const file = res.image//.files[0];
        let image = null
        console.log(file);
        function send(image) {
            let data = {
                ...res,
                image
            }
            axios.post("/api/courses", data, config)
                .then(({ data }) => {
                    message.success(data.msg)
                    // push("/admin/courses")
                })
        }
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => send(reader.result)
            reader.readAsDataURL(file[0]);
            console.log({ image });

        } else send(image)

    }
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
        <form className='bord box col p-20 center ' onSubmit={handleSubmit(onSubmit)}>
            <h1 className="center box my-20">اضافة دورة تدريبية </h1>
            <label htmlFor="title"  >عنوان الدورة </label>
            <input type="text" id="title" {...register("title")} />

            <label htmlFor="description" >وصف الدورة  </label>
            <textarea type="text" id="description" {...register("description")} />

            <label htmlFor="image" >الصورة التعريفية  </label>
            <input type="file" id="image" {...register("image")} />

            <div className="mt-20 w-full box row">
                <Link href={"/admin/courses"} className="p-10 m-0 w-full btn off"  >الغاء </Link>
                <input type='submit' className="mr-10 w-full" />
            </div>
        </form>
    )
}
