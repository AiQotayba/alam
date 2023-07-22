import { User } from "@/lib/models";
import { API, APIAuth } from "@/lib/app";

export default async function users(req, res, next) {
    let { body, query } = req
    let { GET, id, POST, PATCH, DELETE, ALL, PUT, Send } = new API(req, res)
    // let Auth = new APIAuth(req, res)
    PUT(
        // await Auth.getAdmin('admin'),
        async () => {
            let data = {
                fullname: body.fullname,
                email: body.email.toLowerCase(),
                phone: body.phone
            }
            await User.updateOne({ _id: body._id }, data)
            Send({ msg: " تم تحديث الملف الشخصي" })
        })
}
