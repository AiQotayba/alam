import { AuthServerSide } from "@/lib/app2.js";
import { message } from "antd";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/router"; 1

export async function getServerSideProps(ctx) {
    return await AuthServerSide(ctx, "admin", async ({ NEXT_PUBLIC_API, config }) => {
        return { config };
    });
}

export default function CreateChild({ config }) {
    let [Data, setData] = useState({});
    const { register, handleSubmit } = useForm();
    let { query, push } = useRouter();
    const onSubmit = (res) => {
        const file = res.image

        let image = null;
        function send(image) {
            let data = { ...res, image };

            axios.post("/api/admin/course-ads", data, config).then(({ data }) => {
                message.success(data.msg);
                //  push("/admin/course-ads");
            });
        }
        if (file.length > 0) {
            const reader = new FileReader();
            reader.onloadend = () => send(reader.result);
            reader.readAsDataURL(file[0]);
        } else send(image);
    };
    return (
        <form className="bord box col p-20 center" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="center box my-20">اضافة اعلان دورة</h1>

            <label >عنوان الاعلان </label>
            <input type="text" {...register("title")} />

            <label >المدة </label>
            <input type="text" {...register("duration")} />

            <label >السعر </label>
            <input type="number" {...register("price")} />

            <label >فورم التسجيل </label>
            <input type="text" {...register("register")} />

            <label >رقم التواصل </label>
            <select {...register("phone")} >
                <option value={"905380594084"}  >+90 538 059 40 84</option>
                <option value={"96181324565"}  >+961 81 324 565</option> 
            </select>
            
            <label >وصف الدورة </label>
            <textarea {...register("bio")} className="h-200" ></textarea>

            <label >الصورة التعريفية </label>
            <input type="file" {...register("image")} />

            <div className="mt-20 w-full box row">
                <Link href="/admin/course-ads" className="p-10 m-0 w-full btn off"> الغاء </Link>
                <input type="submit" className="mr-10 w-full" />
            </div>

        </form>
    )
} // .split(`src="`)[1].split(`"`)[0]
