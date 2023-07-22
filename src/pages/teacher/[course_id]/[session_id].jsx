import { Popconfirm, Table, message } from "antd";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { useState } from "react";
import { useForm } from "react-hook-form";

export async function getServerSideProps(ctx) {
    // return await AuthServerSide(ctx, 'admin', async ({ NEXT_PUBLIC_API, config }) => {
    let config = {}
    let url = `${process.env.NEXT_PUBLIC_API}/teacher/${ctx.query.course_id}/${ctx.query.session_id}`
    let { data } = await axios.get(url, config);
    return { props: { data, config, url } }
    // })
}

export default function SessionAttendance({ data: propsData, url }) {
    let route = useRouter()
    let [data, setD] = useState(propsData)
    let [selectStudents, setSS] = useState(data.students[0])
    let [selectDisplay, setSD] = useState(false)
    let [rating, setR] = useState(false)

    const { register, handleSubmit } = useForm();
    const onSubmit = async body => {
        let init = {
            child_id: selectStudents._id,
            feedback: body.feedback,
            rating: body.rating,
        }
        let students = data?.students?.filter(a => a._id != init.child_id)

        axios.put(url, init)
            .then(({ data }) => {
                document.querySelector('form').reset()
                setD({ ...data, students })
                setSS(students[0])
                message.success(data.msg)
            })

    }

    function SelectOpen(a) {
        setSD(false)
        setSS(a)
    }
    let ratingContext = ["غياب", "ضعيف جدا", "ضعيف", "معتدل", "جيد جدا", "ممتاز"]
    function FormAtt() {
        if (data.students.length > 0) return (
            <div className="box col w-300 mt-10" >
                {/* select */}
                <div className=" bord p-20 box row space aitem" onClick={() => setSD(true)}  >
                    <p> {`${selectStudents?.name} ${selectStudents?.user_id?.fullname}`}</p>
                    <img src="/icons/down-arrow.svg" alt="icon" width={30} />
                </div>
                {selectDisplay ?
                    <div className="bord p-20  pup w-300 select">
                        {data?.students?.map(st => (
                            <p key={st._id} className="p-10 pl-0 py-20" onClick={() => SelectOpen(st)} style={{ cursor: 'pointer' }} >
                                {`${st.name} ${st.user_id?.fullname}`}
                            </p>
                        ))}
                    </div>
                    : <></>}
                {/* form */}
                <form onSubmit={handleSubmit(onSubmit)} className="w-300 bord py-20">
                    <p className="p-10">التقييم </p>
                    <div onChange={e => setR(e.target.value)}>
                        <input  {...register("rating")} className="w-full" max="5" type="range" />
                    </div>
                    <p>{ratingContext[rating]}</p>
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

                    <Link href={"/teacher"} className="btn ml-10" >
                        <Image src={"/icons/home.svg"} width={20} height={20} />
                        <p className="mx-10">العودة للرئيسية</p>
                    </Link>
                    <Link href={`/teacher/${route.query.course_id}/add-session`} className="btn" >
                        <Image src={"/icons/add.svg"} width={20} height={20} />

                        <p className="mx-10"> اضافة جلسة </p>
                    </Link>
                </div>
            </div>
        )
    }
    function DeleteSession() {
        // send
        axios.delete(url)
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
        <section className=" p-10 m-10 page" >
            <div className="box col bord p-20 ">
                <h1 >{data?.title}</h1>
                <div className="box grid p-10 aitem my-10">

                    <h3>جلسة : {data?.session?.title}</h3>
                    <Popconfirm
                        title="هل أنت متأكد من رغبتك في الحذف؟"
                        onConfirm={handleDelete}
                        onCancel={handleCancel}
                        okText="نعم"
                        cancelText="لا"
                    >
                        <button className="mr-10" >
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