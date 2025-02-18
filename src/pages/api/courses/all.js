import { Courses, User } from "@/lib/models";
import { API, APIAuth } from "@/lib/app";

export default async function CoursesALL(req, res, next) {
    let { GET, POST, Send } = new API(req, res)
    let { body } = req
    GET(
        async () => {
            let { _id } = req.query
            let data = await Courses.findOne({ _id })
                .populate('teacher', "fullname ")
                // .sort({ _id: -1 })
            Send(data)
        });

}
