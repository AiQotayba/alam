import { Child, Courses } from "@/lib/models";
import { API, APIAuth } from "@/lib/app";

export default async function CoursesALL(req, res, next) {
        let { GET, POST, Send } = new API(req, res)
        let Auth = new APIAuth(req, res)

        let { body, query } = req
        GET(
                await Auth.getAdmin("family"),
                async () => {
                        // list childs
                        let child = await Child.findOne({ _id: query.child_id })
                        //  my courses
                        let courses = await Courses.find({ students: { $in: [query.child_id] } }).select("completion title image ")
                        // init data
                        let data = { child, courses }

                        Send(data)


                });


}
