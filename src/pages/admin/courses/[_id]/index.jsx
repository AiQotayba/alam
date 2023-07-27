import { Popconfirm, Table, message } from "antd";
import axios from "axios";
import Link from "next/link";

import { AuthServerSide } from "@/lib/app2";
import { useState } from "react";
import { Input, setChange } from "@/lib/app";
import { useRouter } from "next/router";
import { MenuLine } from "@/lib/ui";
import Image from "next/image";
import { CheckCircleTwoTone } from '@ant-design/icons';

export async function getServerSideProps(ctx) {
        return await AuthServerSide(ctx, 'admin', async ({ NEXT_PUBLIC_API, config }) => {
                let url = `${NEXT_PUBLIC_API}/courses/${ctx.query._id}`
                let { data } = await axios.get(url, config);
                return { data, config }
        })
}

export default function AdminCourses(props) {
        let [data, setD] = useState(props?.data);
        let route = useRouter()
        let URL = `${process.env.NEXT_PUBLIC_API}/courses/${route.query._id}`

        function DeleteCourse() {
                // api
                axios.delete(URL, props.config)
                        .then(({ data }) => {
                                message.success(data.msg)
                                setTimeout(() => route.push("/admin/courses"), 3000)
                        })
        }
        function OK() {
                // api
                axios.patch(URL, {}, props.config)
                        .then(({ data }) => {
                                message.success(data.msg)
                                setTimeout(() => route.push("/admin/courses"), 3000)
                        })
        }

        const handleDelete = () => {
                // تأكيد الحذف وتنفيذ العملية
                DeleteCourse();
                message.success('تم الحذف بنجاح!');
                route.push(`/teacher/${route.query.course_id}`)
        };
        const handleCancel = () => {
                message.error('تم إلغاء الحذف');
        };
        return (
                <section className="bord p-10 m-10">
                        <MenuLine data={{ title: "الكورسات", slug: "/courses" }} />
                        <Info data={data} />
                        <div className="box grid m-10 mt-20" >
                                <Students {...props} />
                                <Teacher  {...props} />
                                <Session {...props} />
                        </div>
                        <div className="box row m-10 mt-20" >
                                <Popconfirm
                                        title="هل أنت متأكدة من ان الكورس  قد انتهى"
                                        onConfirm={OK}
                                        okText="نعم"
                                        cancelText="لا"
                                >
                                        <button className="mr-10 green ml-10 box aitem" >
                                                <CheckCircleTwoTone twoToneColor="#52c41a" />
                                                <p className="mx-10"> انتهاء الكوس </p>
                                        </button>
                                </Popconfirm>
                                <Link href={`${route.asPath}/edit-course`} className="btn m-0" >تعديل معلومات الدورة</Link>
                                <Popconfirm
                                        title="هل أنت متأكد من رغبتك في الحذف؟"
                                        onConfirm={handleDelete}
                                        onCancel={handleCancel}
                                        okText="نعم"
                                        cancelText="لا"
                                >
                                        <button className="mr-10 err" >
                                                <Image src={"/icons/delete.svg"} width={20} height={20} alt="icon" />
                                                <p className="mx-10">حذف الكورس</p>
                                        </button>
                                </Popconfirm>
                        </div>
                </section>
        )
}
function Info({ data }) {
        return (
                <div className="box grid  m-20 ">
                        <Image src={data?.image} width={300} height={200} alt="image" />
                        <div className="box col ">
                                <h1 className="m-20">{data.title}</h1>
                                <div className="mx-20" dangerouslySetInnerHTML={{ __html: data?.description }} />
                        </div>
                </div>
        )
}
function Teacher({ data: propsData, config }) {
        let [data, set] = useState(propsData)
        let route = useRouter()

        function Delete(id) {
                let url = `${process.env.NEXT_PUBLIC_API}/courses/${route.query._id}/teacher?teacher_id=${id}`
                axios.delete(url, config)
                let res = data.teacher.filter(a => a._id !== id)
                let alertData = data.teacher.filter(a => a._id === id)[0]
                message.success(`تم حذف ${alertData.fullname}`)

                set({ ...data, teacher: res })
        }



        const columnsTeacher = [
                { title: "الاسم", dataIndex: "fullname", key: "fullname", fixed: "left" },
                { title: "رقم الهاتف", dataIndex: "phone", key: "phone" },
                {
                        title: "", dataIndex: "view", key: "view",
                        render: (_, record) =>
                                <button onClick={() => Delete(record._id)} >حذف</button>
                }
        ];
        return (
                <div className="m-10 p-20 bord">
                        <div className="m-10 box grid">
                                <h2 className="px-10">المعلمين</h2>
                                <Link href={`${route.asPath}/add-teacher`} className="py-10 btn aitem " >اضافة معلم\ة</Link>
                        </div>
                        <Table dataSource={data?.teacher} columns={columnsTeacher} pagination={false} rowKey={record => record._id} />
                </div>
        )
}
function Students({ data: propsData, config }) {
        let [data, set] = useState(propsData)
        let route = useRouter()

        function Delete(id) {
                let url = `${process.env.NEXT_PUBLIC_API}/courses/${route.query._id}/student?students_id=${id}`
                axios.delete(url, config)
                let res = data.students.filter(a => a._id !== id)
                let alertData = data.students.filter(a => a._id === id)[0]
                message.success(`تم حذف ${alertData.name} ${alertData.fullname}`)

                set({ ...data, students: res })
        }

        const columnsStudents = [
                { title: "الاسم", dataIndex: "name", key: "name" },
                { title: "ولي الامر", dataIndex: "fullname", key: "fullname" },
                { title: "العمر", dataIndex: "age", key: "age" },
                { title: "رقم الهاتف", dataIndex: "phone", key: "phone" },
                {
                        title: "", dataIndex: "view", key: "view",
                        render: (_, record) => <button onClick={() => Delete(record._id)} >حذف</button>
                }
        ];
        return (
                <div className="m-10 p-20 bord scroll">
                        <div className="m-10 box grid aitem">
                                <h2 className="px-10">الطلاب</h2>
                                <Link href={`${route.asPath}/add-student`} className="py-10 btn aitem" >اضافة طالب</Link>
                        </div>
                        <Table dataSource={data?.students} columns={columnsStudents} pagination={false} rowKey={record => record._id} />
                </div>
        )
}
function Session({ data: propsData, config }) {
        let [data, set] = useState(propsData.sessions)
        let route = useRouter()

        function Delete(id) {
                let url = `${process.env.NEXT_PUBLIC_API}/courses/${route.query._id}/session?session_id=${id}`
                let filter = data.filter(a => a._id.toString() !== id)
                set(filter)
                axios.delete(url, config)
                        .then(res => message.success(res.data.msg))
        }
        // completion: boolean;
        const columns = [
                {
                        title: "العنوان", dataIndex: "title", key: "title",
                        render: (_, record) => <Link href={`/${route.asPath}/${record._id}`} >{record.title}</Link>
                },
                { title: "الوقت  ", dataIndex: "time_start", key: "time_start" },
                { title: "التاريخ  ", dataIndex: "date_start", key: "date_start" },
                {
                        title: "الاتمام  ", dataIndex: "completion", key: "completion",
                        render: (_, record) => <p >{record.completion ? " تم الانتهاء " : " لم تنتهي"}</p>
                },
                {
                        title: "", dataIndex: "view", key: "view",
                        render: (_, record) => <button className="err" onClick={() => Delete(record._id)} >حذف</button>
                }
        ];
        return (
                <div className="m-10 p-20 bord scroll">
                        <div className="m-10 box grid aitem">
                                <h2 className="px-10">الجلسات</h2>
                                <Link href={`${route.asPath}/add-session`} className="py-10 btn aitem" >اضافة جلسة</Link>
                        </div>
                        <Table dataSource={data} columns={columns} pagination={false} rowKey={record => record._id} />
                </div>
        )
}
