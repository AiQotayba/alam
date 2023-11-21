import { AuthServerSide } from "@/lib/app2";
import CourseAdsView from "@/pages/course/[_id]";
import { Table, message } from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";

import Link from "next/link";
export async function getServerSideProps(ctx) {
    return await AuthServerSide(ctx, "admin", async ({ NEXT_PUBLIC_API, config }) => {
        let url = `${NEXT_PUBLIC_API}/admin/course-ads/${ctx.query._id}`;
        let { data } = await axios.get(url, config);
        return { data, config };
    });
}
export default function EditChild({ data: propsData, config }) {
    let [data, setData] = useState(propsData.course);
    let [part, setPart] = useState(data.part);
    let [form_port, set_form_port] = useState(false);
    const { register, handleSubmit } = useForm({ defaultValues: data });
    let { query, push } = useRouter();

    const onSubmit = (res) => {
        const file = res.image
        let image = null;
        function send(image) {
            let data = {
                ...res,
                image
            };
            axios.put(`/api/admin/course-ads/${query._id}`, data, config).then(({ data }) => {
                message.success(data.msg);
            });
        }
        if (file.length > 0) {
            const reader = new FileReader();
            reader.onloadend = () => send(reader.result);
            reader.readAsDataURL(file[0]);
        } else send(image);
    };
    function putView(e) {
        setData({ ...data, [e.target.name]: e.target.value });
    }
    function btns(e) {
        [".-info", ".-part", ".-techer"].map((a) => document.querySelector(a).style.display = "none");
        document.querySelector(`.${e.target.name}`).style.display = "flex";
    }
    return (
        <div className="box grid">
            <div className="box col m-20" style={{ maxWidth: "350px"}}>
            
                        <Link href="/admin/course-ads" className="p-10 m-0 w-full btn off"> اعلانات الدورات </Link>
                <div className="box row w-full my-20 bord space">
                    <button name="-info" onClick={btns}> العامة</button>
                    <button name="-part" onClick={btns}> الفقرة</button>
                    <button name="-techer" onClick={btns}> المعلمة</button>
                </div>
                <form className="bord box col p-20 center -info" onChange={putView} onSubmit={handleSubmit(onSubmit)}>
                    <h1 className="center box my-20"> تعديل اعلان دورة </h1>

                    <label>عنوان الاعلان </label>
                    <input type="text" {...register("title")} />

                    <label >المدة</label>
                    <input type="text"{...register("duration")} />

                    <label>السعر</label>
                    <input type="number"{...register("price")} />

                    <label>فورم التسجيل</label>
                    <input type="text" {...register("register")} />
                    <label>وصف الدورة</label>
                    <textarea type="text" {...register("bio")} className="h-200" />
                    <label>الصورة التعريفية</label>
                    <input type="file"{...register("image")} />

                    <div className="mt-20 w-full box row">
                        <Link href="/admin/course-ads" className="p-10 m-0 w-full btn off"> الغاء </Link>
                        <input type="submit" className="mr-10 w-full" />
                    </div>
                </form>
                <div className="box col -part" style={{ display: "none" }}>
                    <ListParts data={part} config={config} />
                    <div className="w-full btn my-20" onClick={() => set_form_port(true)}>add part</div>
                </div>

                <div className="box col -techer" style={{ display: "none" }}>
                    <AddTeacher data={data?.teacher} teachers={propsData.teacher} />
                </div>
                <FormPart
                    part={part}
                    setPart={setPart}
                    useView={{
                        Set: set_form_port,
                        view: form_port
                    }}
                    config={config}
                />
            </div>
                <CourseAdsView data={data} call={false} />
        </div>
    )
}
// --------------------------------------------- 
function AddTeacher(props) {
    const columns = [
        { title: "الاسم", dataIndex: "fullname", key: "fullname" },
        { title: "رقم الهاتف", dataIndex: "phone", key: "phone" },
        {
            title: "", dataIndex: "view", key: "view",
            render: (_, record) => <Add data={record} config={props.config} />
        }
    ];
    return (
        <div className="bord  p-20 center ">
            <h1 className="mb-20">اضافة معلمة</h1>
            <Table dataSource={props.teachers} columns={columns} pagination={false} />
        </div>
    )
}

function Add({ data, config }) {
    let route = useRouter();
    let [CT, setCT] = useState(true);
    function send() {
        if (CT) {
            let URL = `/api/admin/course-ads/${route.query._id}`;
            axios.all(URL, { "_id": data._id }, config)
                .then(({ data }) => message.success(data?.msg));
            setCT(false);
        }
    }
    return <div onClick={send} className={`${CT ? "btn" : ""}`}>{CT ? "اضافة" : "تم الاضافة "}</div>
}
// ---------------------------------------------
function FormPart({ part, setPart, useView, config }) {
    const { register, handleSubmit, reset } = useForm();
    let { query } = useRouter();
    let { view, Set: setView } = useView;
    const Send = (res) => {
        let Data = [...part, res];
        setPart(Data);
        const file = res.image //.files[0];

        let image = null;
        function send(image) {
            let data = { ...res, image };
            axios.post(`/api/admin/course-ads/${query._id}`, data, config).then(({ data }) => {
                message.success(data.msg);
                reset();
                setView(false);
            });
        }
        if (file.length > 0) {
            const reader = new FileReader();
            reader.onloadend = () => send(reader.result);
            reader.readAsDataURL(file[0]);
        } else send(image);
    };
    if (!view) return <></>
    else return (
        <form
            className="bord box col p-20 center "
            onSubmit={handleSubmit(Send)}
            style={{ position: "absolute", zIndex: "1" }
            }>
            <h1 className="center box my-20">تعديل اعلان دورة   </h1>

            <label >عنوان الاعلان</label>
            <input type="text"    {...register("title")} />

            <label >وصف الدورة</label>
            <textarea {...register("about")} className="h-200"></textarea>

            <label>الترتيب</label>
            <input type="number" {...register("Sort")} />

            <label>العرض</label>
            <select {...register("typeView")}>
                <option value="row">عرض افقي (الصورة اولا)</option>
                <option value="row-reverse" >عرض افقي (المحتوى اولا)</option>
                <option value="col">عرض عمودي</option>
            </select>

            <h3 >الصورة التعريفية</h3>
            <input type="file" {...register("image")} />

            <div className="mt-20 w-full box row">
                <Link href="/admin/course-ads" className="p-10 m-0 w-full btn off"> الغاء </Link>
                <input type="submit" className="mr-10 w-full" />
            </div>

        </form>
    )
}
function ListParts(props) {
    let [data, set] = useState(props.data);
    let { query, push } = useRouter();
    function DELETE(id) {
        let url = `/api/admin/course-ads/${query._id}`;
        let New = data?.filter((a) => a._id !== id);
        set(New);
        let O = data?.filter((a) => a._id == id)[0];
        axios.patch(url, New, props.config);
        message.success(`تم حذف الفقرة ${O?.title}`);
    }
    return (
        <div>
            <h2>الفقرات</h2>
            {data.map((a) => (
                <div className="box row space aitem p-10 bord px-20 my-20" key={a._id}>
                    <p>{a.title}</p>
                    <b onClick={() => DELETE(a._id)}>X</b>
                </div>
            ))}
        </div>
    )
}
