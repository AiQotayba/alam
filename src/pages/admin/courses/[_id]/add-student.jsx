import axios from "axios";
import Link from "next/link";

import { AuthServerSide } from "@/lib/app2";
import { useState, useEffect } from "react";
import { Table, message } from "antd";
import { Input, setChange } from "@/lib/app";
import { useRouter } from "next/router";

export async function getServerSideProps(ctx) {
    return await AuthServerSide(ctx, 'admin', async () => { return {} })
}
// add student
// 
export default function CoursesStudent(props) {
    let [data, setData] = useState({ phone: "", name: "" })
    let [student, setStudent] = useState()
    let [loader, setLoader] = useState(false)
    let set = e => setChange(e, data, setData)
    let { query } = useRouter()
    useEffect(() => {

        setTimeout(() => {
            setLoader(true)

            let URL = `${process.env.NEXT_PUBLIC_API}/courses/${query._id}/student?phone=${data?.phone}&name=${data?.name}`
            axios.get(URL, {}).then(({ data }) => {
                setStudent(data)
                setLoader(false)
            }).catch(err => setLoader(false))
        }, 1000)
    }, [data])


    const columns = [
        { title: "الاسم", dataIndex: "name", key: "name" },
        { title: "ولي الامر", dataIndex: "fullname", key: "fullname" },
        { title: "العمر", dataIndex: "age", key: "age" },
        { title: "رقم الهاتف", dataIndex: "phone", key: "phone" },
        {
            title: "", dataIndex: "view", key: "view",
            render: (_, record) => <Add data={record} />
        }
    ];
    return (
        <div className='bord m-10 p-20 center ' >
            <h1 className="mb-20">اضافة طلاب </h1>
            <div className="box row aitem" onChange={set} >
                <Input title="الهاتف" name="phone" className=" ml-10" style={{ width: "130px" }} />
                <Input title="الاسم" name="name" className=" ml-10" style={{ width: "130px" }} />
                {/* <Loader /> */}
                {loader ? <Loader /> : <></>}

            </div>
            {student?.length > 0 ? <Table dataSource={student} columns={columns} pagination={false} /> : ""}

            <div className="mt-20 w-full box row w-300">
                <Link href={`/admin/courses/${query._id}`} className=" btn p-10 w-full off"  >عودة </Link>
            </div>
        </div>
    )
}
function Add({ data }) {
    let route = useRouter()
    let [CT, setCT] = useState("اضافة")

    function send() {

        setCT(false)
        if (CT) {
            let url = `${process.env.NEXT_PUBLIC_API}/courses/${route.query._id}/student?students_id=${data._id}`
            axios.post(url,)
                .then(() => message.success(`تم اضافة ${data.name} ${data.fullname}`))
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
