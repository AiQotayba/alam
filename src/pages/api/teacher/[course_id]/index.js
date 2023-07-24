import { Child, Courses, Session, User } from "@/lib/models";
import { API, APIAuth } from "@/lib/app";

export default async function CoursesALL(req, res, next) {
    let { GET, Send } = new API(req, res)
    let Auth = new APIAuth(req, res)

    let { body, query } = req
    GET(
        await Auth.getAdmin("teacher"),
        async () => {
            let { course_id } = query
            console.log(course_id);
            // course & sessions
            let co = await Courses.findOne({ _id: course_id })
            console.log(co);
            let sessions = await Session.find({ course_id })

            sessions.sort((a, b) => {
                const dateA = new Date(a.date_start);
                const dateB = new Date(b.date_start);
                return dateA - dateB;
            });

            Send({
                title: co.title,
                sessions,
            })
        });
}
