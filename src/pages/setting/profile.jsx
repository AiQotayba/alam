import { message } from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

export async function getServerSideProps(ctx) {
    return await AuthServerSide(ctx, 'family', async () => {

        let { NEXT_PUBLIC_API } = process.env
        let { cookies } = ctx.req
        let _id = "64996c99ec9e55b4ba0a4ac1"
        let url = `${NEXT_PUBLIC_API}/users/${_id}`
        let { data } = await axios.get(url, config);
        return { props: { data, config } }
    })
}
export default function ProfileEdit({ data: propsData }) {
    const { register, handleSubmit } = useForm();
    let route = useRouter()
    const onSubmit = data => {
        let url = `/api/setting`
        data["_id"] = "64996c99ec9e55b4ba0a4ac1"

        axios.put(url, data)
            .then(({ data }) => {
                message.success(data.msg)
                route.back()
            })
    }
    let Obj = {
        "fullname": "Qotayba Mohammad",
        "email": "ktsyr1@gmail.com",
        "phone": "70723177"
    }
    return (
        <div className="box col">
            {/* form */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <h1>{propsData?.fullname}</h1>
                <label htmlFor="fullname" >الادمن</label>
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