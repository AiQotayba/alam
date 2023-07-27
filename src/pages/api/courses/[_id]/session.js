import { Attendance, Child, Courses, Session, User } from "@/lib/models";
import { API, APIAuth } from "@/lib/app";
import bcrypt from 'bcrypt'

export default async function CoursesOne(req, res, next) {
        let { body, query } = req
        let { GET, id, PATCH, POST, ALL, DELETE, PUT, Send } = new API(req, res)
        let Auth = new APIAuth(req, res)



        GET(
                await Auth.getAdmin("admin"),
                async () => {
                        let { session_id } = query
                        let session = await Session.findOne({ _id: session_id })
                        let atten = await Attendance.find().populate("child_id")

                        let attendance = atten.filter(a => a._id === session_id)
                        let user_id = atten.map(a => a.user_id)
                        let users = await User.find({ _id: { $in: user_id } })
                        attendance = attendance.map(a => {
                                let user = users.find(b => a.user_id === b._id)

                                let data = {
                                        name: a.child_id.name,
                                        fullname: user.fullname,
                                        phone: user.phone,
                                        feedback: a.feedback,
                                        rating: a.rating
                                }
                                return data
                        })
                        Send({
                                session,
                                attendance
                        })
                }
        )
        // add student
        POST(
                await Auth.getAdmin("admin"),
                async () => {

                        let { title, time_start, date_start } = body
                        let data = {
                                course_id: query._id,
                                title, time_start, date_start
                        }
                        let NEW = await Session.create(data)
                        console.log(NEW);
                        Send({ msg: "تم اضافة الجلسة", NEW })
                }
        )

        DELETE(
                await Auth.getAdmin("admin"),
                async () => {
                        let { session_id } = query
                        let co = await Session.deleteOne({ _id: session_id }).select("students")
                        let students = co.students?.filter(a => a.toString() !== students_id)
                        await Courses.updateOne(id, { students })

                        Send({ msg: "تم حذف الجلسة" })

                }
        )

}
