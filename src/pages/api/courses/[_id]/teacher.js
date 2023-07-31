import { Courses, User } from "@/lib/models";
import { API, APIAuth } from "@/lib/app";
import bcrypt from 'bcrypt'

export default async function CoursesOne(req, res, next) {
        let { body, query } = req
        let { GET, id, PATCH, POST, ALL, DELETE, PUT, Send } = new API(req, res)
        let Auth = new APIAuth(req, res)



        GET(
                await Auth.getAdmin("admin"),
                async () => {
                        let src = query.src.toLowerCase()
                        let users = await User.find({
                                typeUser: { $in: ["teacher"] },
                                $or: [
                                        { email: { $regex: src || "" } },
                                        { phone: { $regex: src || "" } },
                                ]
                        }).select("fullname phone email")
                        let co = await Courses.findById(query._id).select("teacher")

                        let data = []
                        users.map(a => {
                                let find = co?.teacher.filter(b => b.toString() == a?._id.toString())
                                if (find.length == 0) data.push(a)
                        })
                        Send(data)

                }
        )
        // add student
        POST(
                await Auth.getAdmin("admin"),
                async () => {
                        let _id = body.teacher_id
                        let co = await Courses.findOne(id).select("teacher")
                        co.teacher.push(_id)
                        let teacher = co.teacher?.map(a => a._id.toString())
                        teacher = Array.from(new Set(teacher))
                        await Courses.updateOne(id, { teacher })
                        let co2 = await Courses.findOne(id).select("teacher")
                        Send(co2)
                }
        )

        DELETE(
                await Auth.getAdmin("admin"),
                async () => {
                        let { teacher_id } = query
                        let co = await Courses.findOne(id).select("teacher")
                        let teacher = co.teacher?.filter(a => a.toString() !== teacher_id)
                        await Courses.updateOne(id, { teacher })

                        Send({ msg: "تم حذف المعلمة" })

                }
        )

}
