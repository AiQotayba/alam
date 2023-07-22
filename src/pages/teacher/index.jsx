import { CardCourse, MenuLine, } from "@/lib/ui";
import { Table } from "antd";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";

export async function getServerSideProps(ctx) {
    // return await AuthServerSide(ctx, 'admin', async ({ NEXT_PUBLIC_API, config }) => {
    let config = {}
    let url = `${process.env.NEXT_PUBLIC_API}/teacher?types=courses`

    let { data } = await axios.get(url, config);
    return { props: { data, config } }
    // })
}

export default function AdminUsers(props) {
    // let [data, setD] = useState(() => props?.data.map(a => ({ ...a, view: false })));

    return (
        <section className="box col   bord m-20">
            <h1 className=" p-20">الكورسات</h1>
            <div className="box grid  aitem">

                {props.data?.map(co => (
                    <CardCourse data={co} slug="/teacher/" key={co._id} />
                ))}
            </div>
        </section>
    )
}
