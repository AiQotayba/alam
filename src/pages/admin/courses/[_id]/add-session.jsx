import axios from "axios";
import Link from "next/link";

import { AuthServerSide } from "@/lib/app2";
import { useState, useEffect } from "react";
import { Table, message } from "antd";
import { Input } from "@/lib/app";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

export async function getServerSideProps(ctx) {
    return await AuthServerSide(ctx, 'admin', async (config) => { return { config } })
}

export default function AddSession(props) {
    let { query, push } = useRouter()
    const { register, handleSubmit } = useForm();
    const onSubmit = res => {

        let url = `/api/courses/${query._id}/session`
        axios.post(url, res, props.config)
            .then(({ data }) => {
                message.success(data.msg)
                push(`/admin/courses/${query._id}`)
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
