import { Table, message } from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { CourseContext } from "../pages/admin/courses/[_id]";
import { setChange } from "@/lib/app";

let API = `${process.env.NEXT_PUBLIC_API}/courses`


export function ViewSessionOne() {
    const { data, setData, config, setView, SessionOne, setSessionOne } = useContext(CourseContext);
    let { query } = useRouter()

    let url = `${API}/${query._id}/session?session_id=${SessionOne}`
    useEffect(() => {
        if (typeof SessionOne == "string") {
            axios.get(url, config)
                .then(({ data }) => setSessionOne(data))
        }
    }, [SessionOne, url, config])
    const columns = [
        { title: "الاسم", dataIndex: "name", key: "name" },
        { title: "الاهل  ", dataIndex: "fullname", key: "fullname" },
        { title: "الهاتف", dataIndex: "phone", key: "phone" },
        { title: "الملاحظة", dataIndex: "feedback", key: "feedback", width: 300 },
        { title: "التقييم", dataIndex: "absence", key: "absence", render: (_, record) => <div >{record.absence == true ? "غائب" : <></>}</div> },
    ];
    if (typeof SessionOne == "string") return <div className="box row aitem"><Loader />  </div>
    else return (
        <div className="m-10 p-20 bord scroll">
            <div className="m-10 box col  ">
                <div className="  box grid aitem">
                    <button onClick={() => setView("Session")}>رجوع</button>
                    <h2 className="px-10">جلسة : {SessionOne?.session?.title} </h2>
                    <p>- أ.{SessionOne?.session?.teacher_id.fullname}</p>
                </div>
                <p className="px-10">  {SessionOne?.session?.time_start + " - " + SessionOne?.session?.date_start}</p>
            </div>
            <Table dataSource={SessionOne?.attendance} columns={columns} pagination={false} rowKey={record => record._id} style={{ minWidth: '700px' }} />
        </div>
    )
}

export function AddSession() {
    const { data, setData, config, setView } = useContext(CourseContext);

    let { query } = useRouter()
    const { register, handleSubmit } = useForm();

    const onSubmit = res => axios.post(`${API}/${query._id}/session`, res, config)
        .then(({ data: d }) => {
            data.sessions = [...data.sessions, d.data]
            message.success(d.msg)
            setView("Session")
        })

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-300" >
            <h1>اضافة جلسة</h1>
            <p>العنوان</p>
            <input  {...register("title")} />

            <p>المعلمة</p>
            <select {...register("teacher_id")} >
                {data?.teacher.map(a => (
                    <option value={a._id} key={a._id}>{a.fullname}</option>
                ))}
            </select>
            <p>التاريخ</p>
            <input type='date' {...register("date_start")} />
            <p>الساعة </p>
            <input type='time'  {...register("time_start")} />

            <div className="mt-20 w-full box row">
                <button onClick={() => setView("Session")} className="p-10 w-full btn off"  >الغاء </button>
                <input type="submit" className="mr-20  w-full " />
            </div>
        </form>
    );
}

export function Teacher() {

    const { data, setData, config, setView } = useContext(CourseContext);
    let route = useRouter()

    function Delete(id) {
        let url = `${API}/${route.query._id}/teacher?teacher_id=${id}`
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
                <button onClick={() => setView("AddTeacher")} className="py-10 btn aitem " >اضافة معلم\ة</button>
            </div>
            <Table dataSource={data?.teacher} columns={columnsTeacher} pagination={false} rowKey={record => record._id} />
        </div>
    )
}
export function Students() {
    const { data, setData, config, setView } = useContext(CourseContext);

    let route = useRouter()

    function Delete(id) {
        let url = `${API}/${route.query._id}/student?students_id=${id}`
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
                <button onClick={() => setView("AddStudent")} className="py-10 btn aitem" >اضافة طالب</button>
            </div>
            <Table dataSource={data?.students} columns={columnsStudents} pagination={false} rowKey={record => record._id} />
        </div>
    )
}
export function Session() {
    const { data, setData, config, setView, SessionOne, setSessionOne } = useContext(CourseContext);

    let route = useRouter()

    function Delete(id) {
        let url = `${process.env.NEXT_PUBLIC_API}/courses/${route.query._id}/session?session_id=${id}`

        data.sessions = data.sessions.filter(a => a._id.toString() !== id)
        axios.delete(url, config)
            .then(res => {
                setData({ ...data })
                message.success(res.data.msg)
            })
    }
    // completion: boolean;
    const columns = [
        {
            title: "العنوان", dataIndex: "title", key: "title",
            render: (_, record) => <div style={{ color: '#0292ab' }} onClick={() => {
                setView("ViewSessionOne")
                setSessionOne(record._id)
            }} >{record.title}</div>
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
                <button onClick={() => setView("AddSession")} className="py-10 btn aitem" >اضافة جلسة</button>
            </div>
            <Table dataSource={data.sessions} columns={columns} pagination={false} rowKey={record => record._id} />
        </div>
    )
}

export function EditCourse() {

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

        axios.put(`${API}/${query._id}`, body, config)
            .then(({ data }) => {
                setData({ ...data.data })
                message.success(data.msg)
            })
    }

    return (
        <form className='bord box grid w-300  p-20 center ' onSubmit={handleSubmit(onSubmit)}>
            <h1>تعديل دورة تدريبية </h1>

            <label>عنوان الدورة </label>
            <input  {...register("title")} />

            <label> المدة </label>
            <input  {...register("duration")} />

            <label>وصف الدورة</label>
            <textarea id="description" {...register("description")} className="h-200" />

            <input type='submit' className="mr-10 mt-20 w-full" />
        </form>
    )
}

export function AddStudent() {
    const { config, setView, data: AllData, setData: SetAllData } = useContext(CourseContext);

    const { register, handleSubmit, reset } = useForm()
    let [data, setData] = useState({ phone: "", name: "" })
    let [student, setStudent] = useState()
    let [studentOne, setSO] = useState()
    let [loader, setLoader] = useState(false)
    let { query } = useRouter()
    let [url, setUrl] = useState(`${API}/${query._id}`)
    let set = e => setChange(e, data, setData)

    useEffect(() => {

        setTimeout(() => {
            setLoader(true)

            let URL = `${url}/student?phone=${data?.phone}&name=${data?.name}`
            axios.get(URL, config).then(async (res) => {
                let dataAll = await Promise.all(res.data.map(a => { return { ...a, add: false } }))
                setStudent(dataAll)
                setLoader(false)
            }).catch(err => setLoader(false))
        }, 1000)
    }, [data, config])

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
    function Add({ data }) {
        function send() {
            if (!data.add) setSO(data)
        }
        if (!data.add) return <button onClick={send} className={" "}>اضافة</button>
    }

    function Form({ data: _data }) {
        const onSubmit = body => {
            let One = student?.filter(a => a._id === _data._id)[0]
            One.add = true

            let all = student?.filter(a => a._id != _data._id)
            let students = [...all, One]
            setStudent(students)
            AllData.students = [...AllData.students, One]

            SetAllData({ ...AllData })
            setSO({})
            reset()

            axios.post(`${url}/student?students_id=${_data._id}`, body, config)
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
                    </form >
                </div >
            )
        } else <></>
    }
    return (
        <div className='bord m-10 p-20 center ' >
            <h1 className="mb-20">اضافة طلاب </h1>
            <div className="box row aitem" onChange={set} >
                <label >  الهاتف </label>
                <input type="text"  {...register("phone")} />
                <label >  الاسم </label>
                <input type="text"  {...register("name")} />
                {loader ? <Loader /> : <></>}

            </div>
            <Form data={studentOne} />

            <Table dataSource={student} columns={columns} pagination={false} />

            <div className="mt-20 w-full box row w-300">
                <button onClick={() => setView("Students")} className=" btn p-10 w-full off"  >عودة </button>
            </div>
        </div>
    )
}

export function AddTeacher() {
    const { config, setView, data: AllData, setData: SetAllData } = useContext(CourseContext);

    let [q, set] = useState("")
    let [teacher, setTeacher] = useState()
    let [loader, setLoader] = useState(false)
    let { query } = useRouter()

    useEffect(() => {
        setTimeout(() => {
            setLoader(true)
            let URL = `${API}/${query._id}/teacher`

            axios.get(`${URL}?src=${q}`, config).then(({ data }) => {
                setTeacher(data)
                setLoader(false)
            }).catch(err => setLoader(false))
        }, 1000)
    }, [q, query, config])


    const columns = [
        { title: "الاسم", dataIndex: "fullname", key: "fullname" },
        { title: "رقم الهاتف", dataIndex: "phone", key: "phone" },
        { title: "ايميل", dataIndex: "email", key: "email" },
        {
            title: "", dataIndex: "view", key: "view",
            render: (_, record) => <Add one={record} />
        }
    ];
    function Add({ one }) {
        let route = useRouter()
        let [CT, setCT] = useState("اضافة")

        function send() {
            setCT(false)
            if (CT) {
                let URL = `${API}/${route.query._id}/teacher`
                AllData.teacher = [...AllData.teacher, one]
                SetAllData({ ...AllData })
                axios.post(URL, { "teacher_id": one._id }, config)
                    .then(() => {
                        message.success(`تم اضافة ${one.fullname}`)
                    })
            }
        }
        if (CT) return <div onClick={send} className={"btn"}>اضافة </div>

    }
    return (
        <div className='bord m-10 p-20 center ' >
            <h1 className="mb-20">اضافة معلمة </h1>
            <div className="box row aitem my-10" >
                <label >  الهاتف </label>
                <input type="text" onChange={e => set(e.target.value)} name="phone" className="pb-20" style={{ width: "250px", margin: 'auto 20px' }} />
                {/* <Loader /> */}
                {loader ? <Loader /> : <></>}

            </div>
            <Table dataSource={teacher} columns={columns} pagination={false} />
            <button onClick={() => setView("Teacher")} className="mt-20  btn p-10 w-full off w-300"  >عودة </button>

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
