import { Popconfirm, Table, message } from "antd";
import axios from "axios";
import Link from "next/link";
import { AuthServerSide } from "@/lib/app2";
import { useRouter } from "next/router";
import { MenuLine } from "@/lib/ui";
import { CheckCircleTwoTone } from '@ant-design/icons';
import Image from "next/image";
import { createContext, useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { AddStudent, EditCourse, Session, Students, Teacher, AddTeacher, AddSession, ViewSessionOne } from "@/theme/courses";
export const CourseContext = createContext({});

let API = `${process.env.NEXT_PUBLIC_API}/courses`
export async function getServerSideProps(ctx) {
    return await AuthServerSide(ctx, 'admin', async ({ NEXT_PUBLIC_API, config }) => {
        let url = `${API}/${ctx.query._id}`
        let { data } = await axios.get(url, config);
        return { data, config }
    })
}

export default function AdminCourses(props) {
    let [data, setData] = useState(props?.data);
    let [SessionOne, setSessionOne] = useState({});
    let route = useRouter()
    let URL = `${API}/${route.query._id}`

    let [view, setView] = useState("Session")

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

    let BTN = ({ name, title }) => <button name={name} className={`mx-10 ${name == view ? "off" : ""}`} onClick={btns}> {title}</button>
    let valueContext = {
        data, setData, config: props.config, setView, SessionOne, setSessionOne
    }
    return (
        <section className="  p-10 m-10">
            <CourseContext.Provider value={valueContext} >
                <MenuLine data={{ title: "الدورة التدريبية", slug: "/courses" }} />
                {/* btns */}

                <h1 className="m-20">{data?.title}</h1>
                <div className="box row my-20 bord  ">
                    <BTN name="Students" title={"الطلاب"} />
                    <BTN name="Teacher" title={"المعلمين"} />
                    <BTN name="Session" title={"الجلسات"} />
                    <BTN name="Setting" title={"الاعدادات"} />
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
                    <View name={"AddStudent"}>
                        <AddStudent />
                    </View>
                    <View name={"AddTeacher"}>
                        <AddTeacher />
                    </View>
                    <View name={"AddSession"}>
                        <AddSession />
                    </View>
                    <View name={"ViewSessionOne"}>
                        <ViewSessionOne />
                    </View>
                    <View name={"Setting"}>
                        <div className="box col aitem" >
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
