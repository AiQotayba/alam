import { AuthServerSide } from "@/lib/app2";
import { Popconfirm, Table, message } from "antd";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { useState } from "react";
import { useForm } from "react-hook-form";

export async function getServerSideProps(ctx) {
    return await AuthServerSide(ctx, 'teacher', async ({ NEXT_PUBLIC_API, config }) => {
        let url = `${NEXT_PUBLIC_API}/teacher/${ctx.query.course_id}/${ctx.query.session_id}`
        let { data } = await axios.get(url, config);
        return { data, config, url }
    })
}

export default function SessionAttendance({ data: propsData, url, config }) {
    let route = useRouter()
    let [data, setD] = useState(propsData)
    let [Data, setDa] = useState(propsData)
    let [selectStudents, setSS] = useState(data.students[0])
    let [selectDisplay, setSD] = useState(false) 

    const { register, handleSubmit } = useForm();
    const onSubmit = async body => {
        let init = {
            child_id: selectStudents._id,
            feedback: body.feedback,
            absence: body.absence,
        }
        let students = Data?.students?.filter(a => a._id != init.child_id)

        axios.put(url, init, config)
            .then(({ data }) => {
                document.querySelector('form').reset()
                setDa({ ...Data, students })
                let _ = students.length > 0 ? students[0] : []
                setSS(_)
                message.success(data.msg)
            })

    }

    function SelectOpen(a) {
        setSD(false)
        setSS(a)
    } 
    function FormAtt() {
        if (Data.students.length > 0) return (
            <div className="box col w-300 m-a" >
                {/* select */}
                <div className=" bord p-20 box row space aitem" onClick={() => setSD(true)}  >
                    <p> {`${selectStudents?.name} ${selectStudents?.user_id?.fullname}`}</p>
                    <img src="/icons/down-arrow.svg" alt="icon" width={30} />
                </div>
                {selectDisplay ?
                    <div className="bord p-20 w-300 select" style={{ position: 'absolute', zIndex: '1' }}>
                        {Data?.students?.map(st => (
                            <p key={st._id} className="p-10 pl-0 py-20" onClick={() => SelectOpen(st)} style={{ cursor: 'pointer' }} >
                                {`${st.name} ${st.user_id?.fullname}`}
                            </p>
                        ))}
                    </div>
                    : <></>}
                {/* form */}
                <form onSubmit={handleSubmit(onSubmit)} className="w-300 bord py-20">
                    <div className="box row">
                        <input {...register("absence")} className="mx-10" max="5" type="checkbox" />
                        <p className="p-10">الغياب </p>
                    </div>
                    {/* record.absence == true ? "غائب" : <></> */}
                    <p className="p-10">الملاحضات </p>
                    <textarea className="h-200 p-10" {...register("feedback")} ></textarea>
                    <input type="submit" className="mt-20" />
                </form>
            </div>
        )
        else return (
            <div className="p-10 bord my-10 center box col  " style={{ width: 'max-content', textAlign: 'center' }}>
                <p className="m-20">لقد تم انتهاء تقديم الحضور</p>
                <div className="p-10 box row">

                    <Link href={"/teacher"} className="btn ml-10 box row aitem" >
                        <Image src={"/icons/home.svg"} width={20} height={20} />
                        <p className="mx-10">العودة للرئيسية</p>
                    </Link>
                    <Link href={`/teacher/${route.query.course_id}/add-session`} className="btn box row aitem" >
                        <Image src={"/icons/add.svg"} width={20} height={20} />

                        <p className="mx-10"> اضافة جلسة </p>
                    </Link>
                </div>
            </div>
        )
    }
    function DeleteSession() {
        // send
        axios.delete(url, config)
    }
    const handleDelete = () => {
        // تأكيد الحذف وتنفيذ العملية
        DeleteSession();
        message.success('تم الحذف بنجاح!');
        route.push(`/teacher/${route.query.course_id}`)
    };

    const handleCancel = () => {
        message.error('تم إلغاء الحذف');
    };

    return (
        <section className=" m-a page" >
            <div className="box col bord p-20 m-a ">
                <h1 >{data?.title}</h1>
                <div className="box grid p-10 aitem mt-10">

                    <h3>جلسة : {data?.session?.title}</h3>
                    <Popconfirm
                        title="هل أنت متأكد من رغبتك في الحذف؟"
                        onConfirm={handleDelete}
                        onCancel={handleCancel}
                        okText="نعم"
                        cancelText="لا"
                    >
                        <button className="mr-10 err" >
                            <Image src={"/icons/delete.svg"} width={20} height={20} />
                            <p className="mx-10">حذف الجلسة</p>
                        </button>
                    </Popconfirm>
                </div>
            </div>
            <FormAtt />
        </section >
    )
}
