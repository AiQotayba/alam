import { Attendance, Child, Courses, Session } from "@/lib/models";
import { API, APIAuth } from "@/lib/app";

export default async function CoursesALL(req, res, next) {
    let { GET, POST, PUT, DELETE, Send } = new API(req, res)
    let Auth = new APIAuth(req, res)

    let { body, query } = req
    let { course_id, session_id } = query
    GET(
        await Auth.getAdmin("teacher"),
        async () => {
            //  list student 
            let co = await Courses.findOne({ _id: course_id }).select(" title students")

            let allStudents = await Child.find({ _id: co.students })
                .select("name age user_id")
                .populate("user_id", "fullname")
            let session = await Session.findOne({ _id: session_id })
            let students = []
            let attendants = await Attendance.find({ session_id })
            allStudents.map(a => {
                let find = attendants.filter(b => a._id.toString() === b.child_id.toString())
                if (find.length === 0) students.push(a)
            })
            let data = {
                title: co.title,
                session,
                students,
                attendants
            }
            // let se = await Attendance.find({ session_id }).select("_id")
            // console.log([co.students.length, se.length]);
            Send({ ...data, co: co.students })
        });
    POST(
        await Auth.getAdmin("teacher"),
        async () => {
            // create session
            // ok

            let { title, time_start, date_start } = body
            let data = {
                course_id,
                title, time_start, date_start
            }
            let NEW = await Session.create(data)
            Send({ msg: "تم اضافة الجلسة", NEW })
        }
    )
    PUT(
        await Auth.getAdmin("teacher"),
        async () => {

            // add  feedback student
            let { child_id, feedback, rating } = body

            let data = {
                child_id,
                session_id,
                feedback,
                rating
            }
            let child = await Child.findOne({ _id: child_id }).populate('user_id')
            await Attendance.create(data)
            let co = await Courses.findOne({ _id: course_id }).select("students")
            let se = await Attendance.find({ session_id })
            if (co.students.length - 1 == se.length) {
                await Session.updateOne({ _id: session_id }, { completion: true })
            }
            // await Attendance.deleteMany()
            Send({ msg: `تم اضافة الحضور ${child.name} ${child.user_id?.fullname}` })

        }
    )
    DELETE(
        await Auth.getAdmin("teacher"),
        async () => {
            await Session.deleteOne({ _id: session_id })
            Send({ msg: "تم حذف الجلسة" })
        }
    )
}
