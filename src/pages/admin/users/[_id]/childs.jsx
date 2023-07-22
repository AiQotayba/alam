import axios from "axios";
import Link from "next/link";

import { AuthServerSide } from "@/lib/app2";
import { useState } from "react";
import { Table } from "antd";

export async function getServerSideProps(ctx) {
    return await AuthServerSide(ctx, 'admin', async ({ NEXT_PUBLIC_API, config }) => {
        let url = `${NEXT_PUBLIC_API}/child?_id=${ctx.query._id}`
        let { data } = await axios.patch(url, {},);
        return { data, config }
    })
}
export default function Childs(props) {
    let [data, setData] = useState(props?.data)
    function Delete(id) {
        axios.delete(`${process.env.NEXT_PUBLIC_API}/child/${id}`, props.config)
    }
    const columns = [
        { title: "الاسم", dataIndex: "name", key: "name" },
        { title: "العمر", dataIndex: "age", key: "age" },
        {
            title: "", dataIndex: "view", key: "view",
            render: (_, record) =>
                <button onClick={() => Delete(record._id)} >حذف</button>
        }
    ];
    return (
        <div className='bord m-10 p-20 center ' >
            <h1 className="mb-20">اطفال {data?.fullname}</h1>
            <p className="mb-20">الهاتف {data?.phone}</p>
            {data?.childs.length > 0 ? <Table dataSource={data?.childs} columns={columns} pagination={false} /> : ""}

            <div className="mt-20 w-full box row w-300">
                <Link href={`/admin/users/${data._id}/add-child`} className="p-10 btn ml-10 w-full">اضافة طفل</Link>

                <Link href={"/admin/users"} className=" btn p-10 w-full off"  >عودة </Link>
            </div>
        </div>
    )
}
