import { AuthServerSide } from "@/lib/app2";
import { message } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

export async function getServerSideProps(ctx) {
    return await AuthServerSide(ctx, 'family', async ({ NEXT_PUBLIC_API, config }) => {
        let url = `${NEXT_PUBLIC_API}/setting`
        let { data } = await axios.get(url, config);
        return { data, config }
    })
}
export default function ProfileEdit({ data: propsData, config }) {
    const { register, handleSubmit } = useForm({ defaultValues: propsData });
    let route = useRouter()
    let url = `/api/setting`
    const onSubmit = data => {
        axios.put(url, data, config)
            .then(({ data }) => {
                message.success(data.msg)
                route.back()
            })
    }

    const onSPW = res => {
        let New = document.querySelector("#newpassword").value
        let re = document.querySelector("#renewpassword").value
        if (re != New) message.error("كلمة المرور غير متطابقة")
        else if (New.length < 6) message.error("كلمة المرور قصيرة")
        else axios.patch(url, res, config)
            .then(({ data }) => {
                message.success(data.msg)
                route.back()
            })
    }
    function logout() {
        Cookies.remove("token")
        Cookies.remove("typeUser")
        location.replace("/")
    }
    return (
        <div className="box col">
            {/* form */}
            <form onSubmit={handleSubmit(onSubmit)} className="w-300">
                <h1>تعديل الملف الشخصي</h1>
                <h2>{propsData?.fullname}</h2>
                <label htmlFor="fullname" >الاسم الكامل</label>
                <input type="text" id="fullname"  {...register("fullname")} />

                <label htmlFor="email" >الايميل</label>
                <input type="email" id="email"  {...register("email")} />

                <label htmlFor="phone" >الهاتف</label>
                <input type="text" id="phone"  {...register("phone")} />

                <div className="aitem box mt-20 row w-full">
                    <button
                        className=" btn off w-full"
                        style={{ marginLeft: '10px' }}
                        onClick={() => route.back()}
                    >عودة </button>
                    <input type="submit" className=" w-full " />
                </div>

            </form>
            <form onSubmit={handleSubmit(onSPW)} className="w-300">
                <h2>تحديث كلمة السر</h2>
                <label htmlFor="nowpassword" >كلمة السر القديمة</label>
                <input type="password" id="nowpassword"  {...register("nowpassword")} />

                <label htmlFor="newpassword" >كلمة السر الجديدة</label>
                <input type="password" id="newpassword"  {...register("newpassword")} />

                <label htmlFor="renewpassword" >اعادة كلمة السر الجديدة</label>
                <input type="password" id="renewpassword"  {...register("renewpassword")} />

                <div className="aitem box mt-20 row w-full">
                    <button
                        className=" btn off w-full"
                        style={{ marginLeft: '10px' }}
                        onClick={() => route.back()}
                    >عودة </button>
                    <input type="submit" className=" w-full " />
                </div>

            </form>
            <button onClick={logout} className="w-300 mt-20 m-a center"  >تسجيل الخروج</button>
        </div>
    )
}