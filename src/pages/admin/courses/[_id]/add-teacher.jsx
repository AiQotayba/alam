import axios from "axios";
import Link from "next/link";

import { AuthServerSide } from "@/lib/app2";
import { useState, useEffect } from "react";
import { Table, message } from "antd";
import { Input } from "@/lib/app";
import { useRouter } from "next/router";

export async function getServerSideProps(ctx) {
    return await AuthServerSide(ctx, 'admin', async (config) => { return { config } })
}

export default function AddTeacher(props) {
    let [data, set] = useState("")
    let [teacher, setTeacher] = useState()
    let [loader, setLoader] = useState(false)
    let { query } = useRouter()

    useEffect(() => {
        setTimeout(() => {
            setLoader(true)
            let URL = `${process.env.NEXT_PUBLIC_API}/courses/${query._id}/teacher`

            axios.get(`${URL}?src=${data}`, props.config).then(({ data }) => {
                setTeacher(data)
                setLoader(false)
            }).catch(err => setLoader(false))
        }, 1000)
    }, [data, query])


    const columns = [
        { title: "الاسم", dataIndex: "fullname", key: "fullname" },
        { title: "رقم الهاتف", dataIndex: "phone", key: "phone" },
        { title: "ايميل", dataIndex: "email", key: "email" },
        {
            title: "", dataIndex: "view", key: "view",
            render: (_, record) => <Add data={record} config={props.config} />
        }
    ];
    return (
        <div className='bord m-10 p-20 center ' >
            <h1 className="mb-20">اضافة معلمة </h1>
            <div className="box row aitem" >
                <Input title="الهاتف او الايميل" onChange={e => set(e.target.value)} className="pb-20" style={{ width: "250px" }} />
                {/* <Loader /> */}
                {loader ? <Loader /> : <></>}

            </div>
            <Table dataSource={teacher} columns={columns} pagination={false} />

            <div className="mt-20 w-full box row w-300">

                <Link href={`/admin/courses/${query._id}`} className=" btn p-10 w-full off"  >عودة </Link>
            </div>
        </div>
    )
}
function Add({ data, url, config }) {
    let route = useRouter()
    let [CT, setCT] = useState("اضافة")

    function send() {

        setCT(false)
        if (CT) {
            let URL = `${process.env.NEXT_PUBLIC_API}/courses/${route.query._id}/teacher`

            axios.post(URL, { "teacher_id": data._id }, config)
                .then(() => {
                    message.success(`تم اضافة ${data.fullname}`)
                    // route.push(`/admin/courses/${route.query._id}`)
                })
        }
    }
    return (
        <div onClick={send} className={`${CT ? "btn" : ""}`}>{CT ? "اضافة" : "تم الاضافة "}</div>

    )
}
function Loader() {
    return (
        <div className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    )
}
