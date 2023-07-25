import { Child, Courses, User } from "@/lib/models";
import { API, APIAuth } from "@/lib/app";
import bcrypt from 'bcrypt'

export default async function CoursesOne(req, res, next) {
        let { body, query } = req
        let { GET, id, PATCH, POST, ALL, DELETE, PUT, Send } = new API(req, res)
        let Auth = new APIAuth(req, res)



        GET(
                await Auth.getAdmin("admin"),
                async () => {
                        let { phone, name } = req.query
                        let users = await User.find({ phone: { "$regex": phone } }).select("fullname phone")
                        let childs = await Child.find({ name: { "$regex": name } }).select("_id user_id name age")
                        let co = await Courses.findById(query._id).select("students")

                        let data = []

                        childs.map(child => {
                                const user = users.find(user => user._id.toString() === child.user_id.toString())
                                let init = {
                                        _id: child._id,
                                        fullname: user?.fullname,
                                        phone: user?.phone,
                                        name: child.name,
                                        age: child.age
                                }
                                if (user != undefined) data.push(init)
                                return
                        });
                        let final = []
                        data.map(a => {
                                let find = co?.students?.find(b => b.toString() === a?._id.toString())
                                if (find == undefined) final.push(a)
                        })

                        Send(final)
                }
        )
        // add student
        POST(
                await Auth.getAdmin("admin"),
                async () => {

                        let students_id = query.students_id
                        const co = await Courses.findOne(id);
                        if (co) {
                                let students = co.students
                                students.push(students_id);
                                students = students.map(a => a.toString())
                                co.students = Array.from(new Set(students))
                                await Courses.updateOne(id, { students: co.students })
                        }
                        let data = await Courses.findOne(id).populate("students").select("students")

                        Send(data)
                }
        )
        PUT(
                await Auth.getAdmin("admin"),
                async () => {
                        Send({ msg: " تم تحديث الملف الشخصي" })
                })


        DELETE(
                await Auth.getAdmin("admin"),
                async () => {
                        let { students_id } = query
                        let co = await Courses.findOne(id).select("students")
                        let students = co.students?.filter(a => a.toString() !== students_id)
                        await Courses.updateOne(id, { students })

                        Send({ msg: "تم حذف " })

                }
        )

}
