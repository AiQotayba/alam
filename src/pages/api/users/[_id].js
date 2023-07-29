import { User } from "@/lib/models";
import { API, APIAuth } from "@/lib/app";
import bcrypt from 'bcrypt'

export default async function users(req, res, next) {
        let { body, query } = req
        let { GET, id, POST, PATCH, DELETE, ALL, PUT, Send } = new API(req, res)
        let Auth = new APIAuth(req, res)
        GET(
                await Auth.getAdmin('admin'),
                async () => {

                        let users = await User.findOne(id).select('-password ')
                        Send(users)

                })
        // update typeUser
        POST(
                await Auth.getAdmin('admin'),
                async () => {
                        let typeUser = ["family", ...body]
                        await User.findByIdAndUpdate({ _id: query._id }, { typeUser })
                        Send({ msg: "تم تحديث الصلاحيات" })
                }
        )

        PUT(
                await Auth.getAdmin('admin'),
                async () => {
                        let data = {
                                fullname: body.fullname,
                                email: body.email.toLowerCase(),
                                phone: body.phone
                        }
                        let put = await User.findOneAndUpdate({ _id: query._id }, data)
                        Send({ msg: " تم تحديث الملف الشخصي" })
                })
        PATCH(
                await Auth.getAdmin("admin"),
                async () => {
                        let password = body.password
                        const hash = await bcrypt.hash(password, 12)
                        await User.updateOne(id, { password: hash })
                        Send({ msg: "تم تحديث كلمة المرور" })
                }
        )
        DELETE(
                await Auth.getAdmin("admin"),
                async () => {
                        await User.deleteOne(id)
                        Send({ msg: " تم  حذف الحساب" })
                }
        )
        ALL(
                await Auth.getAdmin("admin"),
                async () => {
                        await User.updateOne(id, { coins: 0 })
                        Send({ msg: " تم تصفير النقاط" })
                } 
        )

}
