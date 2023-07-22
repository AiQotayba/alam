import { Child, User } from "@/lib/models";
import { API, APIAuth } from "@/lib/app"
import mongoose from "mongoose";

export default async function auth(req, res, next) {

    let { body, query } = req
    let { GET, PUT, POST, PATCH, ALL, Send } = new API(req, res)
    let Auth = new APIAuth(req, res)
    let user_id = await Auth.UserId()

    GET(
        // await Auth.isLogin(),
        async () => {
            let data = await Child.find()
            Send(data)
        })
    POST(
        // await Auth.isLogin(),
        async () => {
            let data = {
                user_id: body.user_id,
                name: body.name,
                age: body.age,
            }
            Child.create(data)
            Send({ msg: "تم اظافة الطفل" })
        })
    PATCH(
        // await Auth.isLogin(),
        async () => {
            let user_id = query._id
            user_id = new mongoose.Types.ObjectId(user_id);

            let user = await User.findOne({ _id: user_id }).select("fullname phone")

            let _childs = await Child.find()
            let childs = await _childs.filter(a => a.user_id.toString() === user_id.toString())



            console.log({ childs });
            Send({
                fullname: user.fullname,
                phone: user.phone,
                childs

            })
        }
    )
}