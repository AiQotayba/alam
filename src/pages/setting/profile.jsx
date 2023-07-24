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
    const onSubmit = data => {
        let url = `/api/setting`
        axios.put(url, data, config)
            .then(({ data }) => {
                message.success(data.msg)
                route.back()
            })
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
        </div>
    )
}