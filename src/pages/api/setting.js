import { User } from "@/lib/models";
import { API, APIAuth } from "@/lib/app";
import bcrypt from 'bcrypt'

export default async function users(req, res, next) {
    let { body, query } = req
    let { id, GET, PUT, PATCH, Send } = new API(req, res)
    let Auth = new APIAuth(req, res)

    GET(
        await Auth.getAdmin('family'),
        async () => {
            let users = await User.findOne(await Auth.UserId()).select('-password ')
            Send(users)
        }
    )
    PUT(
        await Auth.getAdmin('family'),
        async () => {
            let data = {
                fullname: body.fullname,
                email: body.email.toLowerCase(),
                phone: body.phone
            }
            let user_id = await Auth.UserId()

            await User.updateOne({ _id: user_id._id }, data)
            Send({ msg: " تم تحديث الملف الشخصي" })
        })
    PATCH(
        await Auth.getAdmin('family'),
        async () => {
            let { newpassword, renewpassword, nowpassword } = body
            let id = await Auth.UserId()
            let findEmail = await User.findOne(id)

            let compare = await bcrypt.compare(nowpassword, findEmail.password)

            if (!compare) {
                return Send({ msg: 'المعلومات غير صحيحة', code: 400 })
            } else if (newpassword === renewpassword) {
                let data = { password: newpassword, }
                let user_id = await Auth.UserId()

                await User.updateOne({ _id: user_id._id }, data)
                Send({ msg: " تم تحديث الملف الشخصي" })
            } else Send({ msg: 'المعلومات غير صحيحة' })
        }
    )
}
