import { AuthServerSide } from "@/lib/app2";
import CourseAdsView from "@/pages/course/[_id]";
import { Table, message } from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import { createContext, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";

export const CourseAdsContext = createContext({});

export async function getServerSideProps(ctx) {
    return await AuthServerSide(ctx, "admin", async ({ NEXT_PUBLIC_API, config }) => {
        let url = `${NEXT_PUBLIC_API}/admin/course-ads/${ctx.query._id}`;
        let { data } = await axios.get(url, config);
        return { data, config };
    });
}
export default function EditADS({ data: propsData, config }) {
    let [data, setData] = useState(propsData.course);
    let [form_port, set_form_port] = useState(false);
    const { register, handleSubmit } = useForm({ defaultValues: data });
    let { query, push } = useRouter();
    let [view, setView] = useState("info")
    // nameView
    const onSubmit = (res) => {
        const file = res.image
        function send(image) {
            delete res.part
            let New = { ...res, image };
            axios.put(`/api/admin/course-ads/${query._id}`, New, config).then(({ data }) => message.success(data.msg))
        }

        if (file.length > 0) {
            if (typeof file == "string") send(file)
            else {
                const reader = new FileReader();
                reader.onloadend = () => send(reader.result);
                reader.readAsDataURL(file[0]);
            }
        } else send(file);
    }
    const View = ({ children, name }) => {
        if (name == view) return <>{children}</>
        else <></>
    }
    function putView(e) {
        // setData({ ...data, [e.target.name]: e.target.value });
    }
    let btns = e => setView(e.target.name)

    return (
        <div className="box grid">
            <CourseAdsContext.Provider value={{
                data, setData, teacher: propsData.teacher,
                useView: { Set: set_form_port, view: form_port }, config
            }}>
                <div className="box col m-20" style={{ maxWidth: "350px" }}>

                    <Link href="/admin/course-ads" className="p-10 m-0 w-full btn off"> اعلانات الدورات </Link>
                    <div className="box row w-full my-20 bord space">
                        <button name="info" onClick={btns}> العامة</button>
                        <button name="part" onClick={btns}> الفقرة</button>
                        <button name="techer" onClick={btns}> المعلمة</button>
                    </div>
                    <View name={"info"}>
                        <form className="bord box col p-20 center " style={{ width: '350px' }} onChange={putView} onSubmit={handleSubmit(onSubmit)}>
                            <h1 className="center box my-20"> تعديل اعلان دورة </h1>

                            <label>عنوان الاعلان </label>
                            <input type="text" {...register("title")} />

                            <label >المدة</label>
                            <input type="text"{...register("duration")} />

                            <label>السعر</label>
                            <input type="number"{...register("price")} />

                            <label>فورم التسجيل</label>
                            <input type="text" {...register("register")} />

                            <label >رقم التواصل </label>
                            <select {...register("phone")} >
                                <option value={"905380594084"}  >الرقم التركي</option>
                                <option value={"96181324565"}  >الرقم اللبناني</option>
                            </select>
 

                            <label>الترتيب</label>
                            <input type="number" {...register("sort")} /> 

                            <label >وصف الدورة </label>
                            <textarea {...register("bio")} className="h-200" ></textarea>

                            <label >الصورة التعريفية </label>
                            <input type="file" {...register("image")} />

                            <div className="box row m-10">
                                <input type="checkbox"{...register("display")} />
                                <label className="px-10">نشر</label>
                            </div>

                            <div className="mt-20 w-full box row">
                                <Link href="/admin/course-ads" className="p-10 m-0 w-full btn off"> الغاء </Link>
                                <input type="submit" className="mr-10 w-full" />
                            </div>
                        </form>
                    </View>
                    <View name={"part"}>
                        <div className="box col " style={{ width: '350px' }}  >
                            <ListParts />
                            <div className="w-full btn my-20" onClick={() => set_form_port(true)}>add part</div>
                        </div>
                    </View>
                    <View name={"techer"}>
                        <div className="box col " style={{ width: '350px' }}>
                            <AddTeacher />
                        </div>
                    </View>
                    <FormPart />
                </div>
                <CourseAdsView data={data} call={false} />
            </CourseAdsContext.Provider>
        </div>
    )
}
// --------------------------------------------- 
function AddTeacher(props) {

    const { data, setData, teacher, config } = useContext(CourseAdsContext);

    const columns = [
        { title: "الاسم", dataIndex: "fullname", key: "fullname" },
        { title: "رقم الهاتف", dataIndex: "phone", key: "phone" },
        {
            title: "", dataIndex: "view", key: "view",
            render: (_, record) => <Add one={record} />
        }
    ];
    return (
        <div className="bord  p-20 center ">
            <h1 className="mb-20">اضافة معلمة</h1>
            <Table dataSource={teacher} columns={columns} pagination={false} rowKey={(record) => record._id} />
        </div>
    )
}

function Add({ one }) {

    const { data, setData, config } = useContext(CourseAdsContext);
    let route = useRouter();

    let teacher = data?.teacher
    let [StateTeacher, setStateTeacher] = useState(() => teacher.filter(a => a._id == one._id))
    let [CT, setCT] = useState(StateTeacher.length > 0 ? false : true);

    function send() {
        let URL = `/api/admin/course-ads/teacher?_id=${route.query._id}`;

        if (CT) {
            axios.put(URL, { "_id": one._id, type: "post" }, config)
                .then(({ data: dm }) => {
                    teacher = [...teacher, one]
                    console.log({ ...data, teacher })
                    setData({ ...data, teacher })
                    message.success(dm?.msg)
                    setCT(false);
                });
        } else {
            axios.put(URL, { "_id": one._id, type: "delete" }, config)
                .then(({ data: dm }) => {
                    data.teacher = data.teacher.filter(a => a._id != one._id)
                    setData(data)
                    message.error(dm?.msg)
                    setCT(true);
                });
        }
    }
    if (CT) return <button onClick={send} className={" "}>اضافة</button>
    else return <button onClick={send} className={"err"}>حذف </button>
}
// ---------------------------------------------
function FormPart() {
    const { register, handleSubmit, reset } = useForm();
    let { query } = useRouter();
    const { data, setData, teacher, useView, config } = useContext(CourseAdsContext);

    let { view, Set: setView } = useView;
    const Send = (res) => {
        const file = res.image //.files[0];

        let image = null;
        function send(image) {
            let part = { ...res, image };

            setData({ ...data, part: [...data.part, part] });
            axios.post(`/api/admin/course-ads/${query._id}`, part, config).then(({ data: d }) => {
                message.success(d.msg);
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
function ListParts() {
    const { data, setData, config } = useContext(CourseAdsContext);
    let { query } = useRouter();
    function DELETE(id) {
        let url = `/api/admin/course-ads/${query._id}`;
        let part = data.part?.filter((a) => a._id !== id);
        setData({ ...data, part });
        let O = data.part?.filter((a) => a._id == id)[0];
        axios.patch(url, part, config);
        message.success(`تم حذف الفقرة ${O?.title}`);
    }
    return (
        <div>
            <h2>الفقرات</h2>
            {data.part.map((a) => (
                <div className="box row space aitem p-10 bord px-20 my-20" key={a._id}>
                    <p>{a.title}</p>
                    <b onClick={() => DELETE(a._id)}>X</b>
                </div>
            ))}
        </div>
    )
}
