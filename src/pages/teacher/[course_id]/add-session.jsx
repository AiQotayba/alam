import { message } from "antd";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

export async function getServerSideProps(ctx) {
    return await AuthServerSide(ctx, 'teacher', async ({ NEXT_PUBLIC_API, config }) => {
        return { config }
    })
}
export default function AddSession({ config }) {
    const { register, handleSubmit } = useForm();
    let route = useRouter()
    let { query } = route

    const onSubmit = data => {

        let url = `/api//teacher/${query.course_id}/add-session`
        axios.post(url, data, config)
            .then(({ data }) => {
                message.success(data.msg)
                route.push(`/teacher/${query.course_id}/${data.NEW._id}`)
            })
    }


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1>اضافة جلسة</h1>
            <p>العنوان</p>
            <input  {...register("title")} />
            <p>التاريخ</p>
            <input type='date' {...register("date_start")} />
            <p>الساعة </p>
            <input type='time'  {...register("time_start")} />


            <div className="mt-20 w-full box row">
                <Link href={`/teacher/${query.course_id}`} className="p-10 w-full btn off"  >الغاء </Link>
                <input type="submit" className="mr-20  w-full " />
            </div>
        </form>
    );
}
