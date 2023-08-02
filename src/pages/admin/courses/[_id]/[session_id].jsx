import axios from "axios";
import Link from "next/link";

import { AuthServerSide } from "@/lib/app2";
import { useState } from "react";
import { useRouter } from "next/router";
import { Table, message } from "antd";
import { useForm } from "react-hook-form";

export async function getServerSideProps(ctx) {
    return await AuthServerSide(ctx, 'admin', async ({ NEXT_PUBLIC_API, query, config }) => {
        let url = `${NEXT_PUBLIC_API}/courses/${ctx.query._id}/session?session_id=${query.session_id}`
        console.log(url);
        let { data } = await axios.get(url, config);
        return { data, config }
    })
}

export default function EditChild({ data: propsData, config }) {
    const { register, handleSubmit } = useForm();

    let [data, setData] = useState(propsData.attendance)
    let route = useRouter()
    let { query, push } = route
    const columns = [
        { title: "العنوان", dataIndex: "title", key: "title" },
        { title: "الوقت  ", dataIndex: "time_start", key: "time_start" },
        { title: "التاريخ  ", dataIndex: "date_start", key: "date_start" },
    ];
    return (
        <div className="m-10 p-20 bord scroll">
            <div className="m-10 box col  ">
                <div className="  box grid aitem">
                    <h2 className="px-10">جلسة : {propsData.session.title} </h2>
                    <button onClick={route.back()}>رجوع</button>
                </div>
                <p className="px-10">  {propsData.session.date_start + " - " + propsData.session.date_start}</p>
            </div>
            <Table dataSource={data} columns={columns} pagination={false} rowKey={record => record._id} />
        </div>
    )
}
