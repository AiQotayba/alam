import { Attendance, Child, Courses } from "@/lib/models";
import { API, APIAuth } from "@/lib/app";

export default async function CoursesALL(req, res, next) {
    let { GET, POST, Send } = new API(req, res)
    let Auth = new APIAuth(req, res)

    let { body, query } = req
    GET(
        await Auth.getAdmin("family"),
        async () => {
            let { child_id, course_id } = query
            // info 
            let course = await Courses.findOne({ _id: course_id })
                .select("title image teacher completion description ")
                .populate("teacher", "fullname")

            // list attendants
            let attendants = await Attendance.find({ child_id })
                .populate("session_id")
                .populate("child_id")

            //  avrage
            let data = {
                course,
                attendants
            }

            Send(data)
        });
}