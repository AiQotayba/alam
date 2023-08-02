import { AuthServerSide } from "@/lib/app2";
import { message } from "antd";
import axios from "axios";
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
    const { register, handleSubmit } = useForm();
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
    function verifyRe(e) {
        // let re = e.target.value
        // let New = document.querySelector("#newpassword").value
        // if (re !== New) message.error("كلمة المرور غير متطابقة")
    }
    function verifyNew(e) {
        // let New = document.querySelector("#newpassword").value
        // if (New.length > 6) message.error("كلمة المرور قصيرة")
    }
    return (
        <div className="box col">
            {/* form */}
            <form onSubmit={handleSubmit(onSubmit)} className="w-300">
                <h1>تعديل الملف الشخصي</h1>
                <h2>{propsData?.fullname}</h2>
                <label htmlFor="fullname" >الاسم الكامل</label>
                <input type="text" id="fullname"  {...register("fullname")} defaultValue={propsData?.fullname} />

                <label htmlFor="email" >الايميل</label>
                <input type="email" id="email"  {...register("email")} defaultValue={propsData?.email} />

                <label htmlFor="phone" >الهاتف</label>
                <input type="text" id="phone"  {...register("phone")} defaultValue={propsData?.phone} />

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
                <input type="password" id="newpassword"  {...register("newpassword")} onChange={verifyNew} />

                <label htmlFor="renewpassword" >اعادة كلمة السر الجديدة</label>
                <input type="password" id="renewpassword"  {...register("renewpassword")} onChange={verifyRe} />

                <div className="aitem box mt-20 row w-full">
                    <button
                        className=" btn off w-full"
                        style={{ marginLeft: '10px' }}
                        onClick={() => route.back()}
                    >عودة </button>
                    <input type="submit" className=" w-full " />
                </div>

            </form>

        </div>
    )
}