import { Attendance, Child, Courses, Session, User } from "@/lib/models";
import { API, APIAuth } from "@/lib/app";
import bcrypt from 'bcrypt'

export default async function CoursesOne(req, res, next) {
    let { body, query } = req
    let { GET, id, PATCH, POST, ALL, DELETE, PUT, Send } = new API(req, res) 
    GET(async () => {
        let { session_id } = query
        let session = await Session.findOne({ _id: session_id })
        let atten = await Attendance.find().populate("child_id")
        let attendance = atten.filter(a => a.session_id.toString() == session_id)

        let user_id = attendance.map(a => a.child_id.user_id)
        let users = await User.find({ _id: { $in: user_id } }).select("_id fullname phone")

        attendance = await Promise.all(attendance.map(async a => {
            let user = await users.filter(b => a.child_id.user_id.toString() === b._id.toString())[0]
            let data = {
                name: a.child_id.name,
                fullname: user?.fullname,
                phone: user?.phone,
                feedback: a?.feedback,
                rating: a?.rating
            }

            return data
        }))
        Send({
            session,
            attendance
        })
    })
    // add student
    POST(async () => {

        let { title, time_start, date_start,teacher_id } = body
        let NEW = {
            course_id: query._id,
            title, time_start, date_start ,teacher_id

        }
        let a = await Session.create(NEW)
        let data = await Session.findOne({_id:a._id}).populate("teacher_id", "fullname phone ")
        Send({ msg: "تم اضافة الجلسة", data })
    })

    DELETE(async () => {
        let { session_id } = query
        let co = await Session.deleteOne({ _id: session_id }).select("students")
        let students = co.students?.filter(a => a.toString() !== students_id)
        await Courses.updateOne(id, { students })

        Send({ msg: "تم حذف الجلسة" })
    })
    
}
