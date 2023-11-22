import { Popconfirm, Table, message } from "antd";
import axios from "axios";
import Link from "next/link";

import { AuthServerSide } from "@/lib/app2";
import { useRouter } from "next/router";
import { MenuLine } from "@/lib/ui";
import { CheckCircleTwoTone } from '@ant-design/icons';
import Image from "next/image";
import { createContext, useState, useContext } from "react";
import { useForm } from "react-hook-form";
export const CourseContext = createContext({});

export async function getServerSideProps(ctx) {
    return await AuthServerSide(ctx, 'admin', async ({ NEXT_PUBLIC_API, config }) => {
        let url = `${NEXT_PUBLIC_API}/courses/${ctx.query._id}`
        let { data } = await axios.get(url, config);
        return { data, config }
    })
}

export default function AdminCourses(props) {
    let [data, setData] = useState(props?.data);
    let route = useRouter()
    let URL = `${process.env.NEXT_PUBLIC_API}/courses/${route.query._id}`

    let [view, setView] = useState("Setting")

    const View = ({ children, name }) => {
        if (name == view) return <>{children}</>
        else <></>
    }
    let btns = e => setView(e.target.name)

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
        axios.delete(URL, props.config)
            .then(({ data }) => {
                message.success(data.msg)
                setTimeout(() => route.push("/admin/courses"), 3000)
            })
    };
    const handleCancel = () => {
        message.error('تم إلغاء الحذف');
    };
    return (
        <section className="  p-10 m-10">
            <CourseContext.Provider value={{ data, setData, config: props.config }} >
                <MenuLine data={{ title: "الدورة التدريبية", slug: "/courses" }} />
                {/* btns */}

                <h1 className="m-20">{data?.title}</h1>
                <div className="box row my-20 bord  ">
                    <button name="Students" className="mx-10" onClick={btns}> الطلاب</button>
                    <button name="Teacher" className="mx-10" onClick={btns}> المعلمين</button>
                    <button name="Session" className="mx-10" onClick={btns}> الجلسات</button>
                    <button name="Setting" className="mx-10" onClick={btns}> الاعدادات</button>
                </div>
                <div className="box col  mt-20" >
                    <View name={"Students"}>
                        <Students />
                    </View>
                    <View name={"Teacher"}>
                        <Teacher />
                    </View>
                    <View name={"Session"}>
                        <Session />
                    </View>
                    <View name={"Setting"}>
                        <div className="box col m-10 mt-20 w-300" >

                            <EditCourse />
                            <div className="box col m-10 mt-20 w-300" >
                                <Popconfirm
                                    title="هل أنت متأكدة من ان الدورة التدريبية  قد انتهى"
                                    onConfirm={OK}
                                    okText="نعم"
                                    cancelText="لا"
                                >
                                    <button className="m-10 green box aitem" >
                                        <CheckCircleTwoTone twoToneColor="#52c41a" />
                                        <p className="mx-10" >انتهاء الدورة   </p>
                                    </button>
                                </Popconfirm>
                                <Popconfirm
                                    title="هل أنت متأكد من رغبتك في الحذف؟"
                                    onConfirm={handleDelete}
                                    onCancel={handleCancel}
                                    okText="نعم"
                                    cancelText="لا"
                                >
                                    <button className=" err" >
                                        <Image src={"/icons/delete.svg"} width={20} height={20} alt="icon" />
                                        <p className="mx-10">حذف الدورة  </p>
                                    </button>
                                </Popconfirm>
                            </div>
                        </div>
                    </View>
                </div>
            </CourseContext.Provider>
        </section>
    )
}
function Teacher() {

    const { data, setData, config } = useContext(CourseContext);
    let route = useRouter()

    function Delete(id) {
        let url = `${process.env.NEXT_PUBLIC_API}/courses/${route.query._id}/teacher?teacher_id=${id}`
        axios.delete(url, config)
        let res = data.teacher.filter(a => a._id !== id)
        let alertData = data.teacher.filter(a => a._id === id)[0]
        message.success(`تم حذف ${alertData.fullname}`)

        setData({ ...data, teacher: res })
    }
    const columnsTeacher = [
        { title: "الاسم", dataIndex: "fullname", key: "fullname", fixed: "left" },
        { title: "رقم الهاتف", dataIndex: "phone", key: "phone" },
        {
            title: "", dataIndex: "view", key: "view",
            render: (_, record) =>
                <button className="err" onClick={() => Delete(record._id)} >حذف</button>
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
function Students() {
    const { data, setData, config } = useContext(CourseContext);

    let route = useRouter()

    function Delete(id) {
        let url = `${process.env.NEXT_PUBLIC_API}/courses/${route.query._id}/student?students_id=${id}`
        axios.delete(url, config)
        let res = data.students.filter(a => a._id !== id)
        let alertData = data.students.filter(a => a._id === id)[0]
        message.success(`تم حذف ${alertData.name} ${alertData.fullname}`)

        setData({ ...data, students: res })
    }

    const columnsStudents = [
        { title: "الاسم", dataIndex: "name", key: "name" },
        { title: "ولي الامر", dataIndex: "fullname", key: "fullname" },
        { title: "العمر", dataIndex: "age", key: "age" },
        { title: "رقم الهاتف", dataIndex: "phone", key: "phone" },
        {
            title: "", dataIndex: "view", key: "view",
            render: (_, record) => <button className="err" onClick={() => Delete(record._id)} >حذف</button>
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
function Session() {
    const { data, setData, config } = useContext(CourseContext);

    let route = useRouter()

    function Delete(id) {
        let url = `${process.env.NEXT_PUBLIC_API}/courses/${route.query._id}/session?session_id=${id}`
        let filter = data.sessions.filter(a => a._id.toString() !== id)
        setData(filter)
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
        { title: "المعلمة  ", dataIndex: "teacher_id", key: "teacher_id", render: (_, record) => <p>{record?.teacher_id?.fullname}</p> },
        {
            title: "الاتمام  ", dataIndex: "completion", key: "completion",
            render: (_, record) => <p >{record.completion ? " تم الانتهاء " : " لم تنتهي"}</p>
        },
        {
            title: "", dataIndex: "view", key: "view", width: 200,
            render: (_, record) => <button className="err" onClick={() => Delete(record._id)} >حذف</button>
        }
    ];
    return (
        <div className="m-10 p-20 bord scroll">
            <div className="m-10 box grid aitem">
                <h2 className="px-10">الجلسات</h2>
                <Link href={`${route.asPath}/add-session`} className="py-10 btn aitem" >اضافة جلسة</Link>
            </div>
            <Table dataSource={data.sessions} columns={columns} pagination={false} rowKey={record => record._id} />
        </div>
    )
}

function EditCourse() {

    const { data, setData, config } = useContext(CourseContext);
    const { register, handleSubmit } = useForm({ defaultValues: data });
    let { query, push } = useRouter()

    const onSubmit = res => {
        let body = {
            title: res.title,
            description: res.description,
            price: res.price,
            duration: res.duration,
            register: res.register
        }
        console.log({ data, config });

        let path = `courses/${query._id}`
        axios.put(`/api/${path}`, body, config)
            .then(({ data }) => {
                setData({ ...data.data })
                message.success(data.msg)
            })
    }

    return (
        <form className='bord box grid   p-20 center ' onSubmit={handleSubmit(onSubmit)}>
            <h1>تعديل دورة تدريبية </h1>
            <div className="box col w-300"  >

                <p>عنوان الدورة </p>
                <input  {...register("title")} />

                <p> المدة </p>
                <input  {...register("duration")} />

            </div>
            <div className="box col" >

                <p>وصف الدورة</p>
                <textarea id="description" {...register("description")} className="h-200" />

                <div className="mt-20 w-full box row">
                    <Link href={`/admin/courses/${query._id}`} className="p-10 w-full btn m-0 off"  >الغاء </Link>
                    <input type='submit' className="mr-10 w-full" />
                </div>
            </div>
        </form>
    )
}

function Info({ data }) {
    return (
        <div className="box grid  m-20 ">
            <div className="box col ">
                <h1 className="m-20">{data?.title}</h1>
                <div className="mx-20" dangerouslySetInnerHTML={{ __html: data?.description }} />
            </div>
        </div>
    )
}
