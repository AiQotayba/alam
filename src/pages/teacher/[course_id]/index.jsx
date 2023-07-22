import session from "@/lib/models/session";
import { MenuLine } from "@/lib/ui";
import { Table } from "antd";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export async function getServerSideProps(ctx) {
    // return await AuthServerSide(ctx, 'admin', async ({ NEXT_PUBLIC_API, config }) => {
    let config = {}
    let url = `${process.env.NEXT_PUBLIC_API}/teacher/${ctx.query.course_id}`
    let { data } = await axios.get(url, config);
    return { props: { data, config } }
    // })
}

export default function AdminUsers({ data }) {
    let route = useRouter()
    return (
        <section className=" p-10 m-10 page">
            <div className="box col bord p-10 ">
                <h1 >{data?.title}</h1>
                <div className="box grid p-10 aitem my-20">

                    <h3>الجلسات</h3>
                    <Link href={`${route.asPath}/add-session`} className="btn mx-10" >اضافة جلسة</Link>
                </div>
            </div>
            {/* sessions */}
            {data?.sessions?.map(session => (
                <Link href={`${route.asPath}/${session._id}`} className="card p-20 " key={session._id} style={{ border: `1px solid ${!session?.completion ? "#2196F3" : "#E91E63"}` }}>
                    {/* <img src={co.image} alt="" /> */}
                    <b>{session.title}</b>
                    <div className="box row space">
                        <p>{session?.time_start}</p>
                        <p>{session?.date_start}</p>
                    </div>
                </Link>
            ))}
        </section>
    )
}
