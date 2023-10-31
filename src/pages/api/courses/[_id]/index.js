import { Attendance, Courses, Session, User } from "@/lib/models";
import { API, APIAuth } from "@/lib/app";
import bcrypt from 'bcrypt'

export default async function CoursesOne(req, res, next) {
        let { body, query } = req
        let { GET, id, PATCH, DELETE, PUT, Send } = new API(req, res)
        let Auth = new APIAuth(req, res)
        GET(
                await Auth.getAdmin('admin'),
                async () => {

                        let courses = await Courses.findOne(id)
                                .populate("students")
                                .populate("teacher", "fullname phone ")
                        if (courses) {
                                let users_id = await courses?.students?.map(data => data?.user_id)
                                let users = await User.find({ _id: { $in: users_id } }).select("fullname phone ")
                                let _students = courses?.students
                                courses["students"] = []
                                let students = []

                                await Promise.all(_students?.map(async data => {
                                        let user = await users.filter(a => a._id.toString() === data.user_id.toString())[0]

                                        students.push({
                                                _id: data._id,
                                                name: data?.name,
                                                age: data?.age,
                                                fullname: user?.fullname,
                                                phone: user?.phone,
                                        })

                                }))
                                let Sessions = await Session.find() .populate("teacher_id", "fullname phone ")
                                let sessions = await Sessions.filter(a => a.course_id.toString() === query._id)

                                await Object.assign(courses, { students })
                                let data = {
                                        ...courses._doc,
                                        students,
                                        sessions
                                }
                                Send(data)
                        } else Send(null)

                })
        PUT(
                await Auth.getAdmin("admin"),
                async () => {
                        let data = {
                                title: body.title,
                                description: body.description,
                                price: body.price,
                                duration: body.duration,
                                register: body.register,
                                image: body.image,
                        } 
                        await Courses.updateOne(id, data)
                        Send({ msg: "تم تحديث الدورة التدريبية", data })
                }
        )
        PATCH(
                await Auth.getAdmin("admin"),
                async () => {

                        await Courses.updateOne(id, { completion: true })
                        Send({ msg: "تم اتمام الدورة التدريبية" })

                }
        )
        DELETE(
                await Auth.getAdmin("admin"),
                async () => {
                        await Courses.deleteOne(id)
                        Send({ msg: "تم حذف الدورة التدريبية" })

                }
        )

}
