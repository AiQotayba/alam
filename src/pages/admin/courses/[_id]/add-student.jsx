import axios from "axios";
import Link from "next/link";

import { AuthServerSide } from "@/lib/app2";
import { useState, useEffect } from "react";
import { Table, message } from "antd";
import { Input, setChange } from "@/lib/app";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

export async function getServerSideProps(ctx) {
    return await AuthServerSide(ctx, 'admin', async (config) => { return { config } })
}
// add student
// 
export default function CoursesStudent({ config }) {
    const { register, handleSubmit } = useForm();
    let [data, setData] = useState({ phone: "", name: "" })
    let [student, setStudent] = useState()
    let [studentOne, setSO] = useState()
    let [loader, setLoader] = useState(false)
    let set = e => setChange(e, data, setData)
    let { query } = useRouter()
    useEffect(() => {

        setTimeout(() => {
            setLoader(true)

            let URL = `${process.env.NEXT_PUBLIC_API}/courses/${query._id}/student?phone=${data?.phone}&name=${data?.name}`
            axios.get(URL, config).then(async (res) => {
                let dataAll = await Promise.all(res.data.map(a => { return { ...a, add: false } }))
                setStudent(dataAll)
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
            render: (_, record) => <Add data={record} config={config} set={setSO} />
        }
    ];
    function Add(props) {
        let { data, config } = props
        function send() {
            if (!data.add) {
                props.set(data)
            }
        }
        return (
            <div onClick={send} className={`${!data.add ? "btn" : ""}`}>{!data.add ? "اضافة" : "تم الاضافة "}</div>
        )
    }
    function Form({ data: _data }) {
        const onSubmit = body => {
            let One = student?.filter(a => a._id === _data._id)[0]
            console.log(One);
            One.add = true
            console.log(One);

            let all = student?.filter(a => a._id != _data._id)
            let full = [...all, One]
            setStudent(full)
            setSO({})
            let url = `${process.env.NEXT_PUBLIC_API}/courses/${query._id}/student?students_id=${_data._id}`
            document.querySelector('form').reset()

            axios.post(url, body, config)
                .then(() => {
                    message.success(`تم اضافة ${_data.name} ${_data.fullname} و تم اضافة ${body.cash / 20} نقطة`)
                })


        }
        if (_data?.name) {
            return (
                <div className="full">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* name */}
                        <h2>{`${_data?.name} ${_data?.fullname}`}</h2>
                        {/* cash */}
                        <label htmlFor="cash"  >المبلغ المدفوع</label>
                        <input type="number" id="cash" {...register("cash")} defaultValue={0} />

                        {/* select */}

                        <div className="mt-20 w-full box row">
                            <div className="p-10 btn w-full off" onClick={() => setSO({})} >الغاء </div>
                            <input type="submit" className="mr-20  w-full " />
                        </div>
                    </form>
                </div>
            )
        } else <></>
    }
    return (
        <div className='bord m-10 p-20 center ' >
            <h1 className="mb-20">اضافة طلاب </h1>
            <div className="box row aitem" onChange={set} >
                <Input title="الهاتف" name="phone" className=" ml-10" style={{ width: "130px" }} />
                <Input title="الاسم" name="name" className=" ml-10" style={{ width: "130px" }} />
                {/* <Loader /> */}
                {loader ? <Loader /> : <></>}

            </div>
            <Form data={studentOne} />

            <Table dataSource={student} columns={columns} pagination={false} />

            <div className="mt-20 w-full box row w-300">
                <Link href={`/admin/courses/${query._id}`} className=" btn p-10 w-full off"  >عودة </Link>
            </div>
        </div>
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
