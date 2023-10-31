import { Child, Courses, Session, User } from "@/lib/models";
import { API, APIAuth } from "@/lib/app";

export default async function TeacherHmoeApi(req, res, next) {
        let { GET, POST, Send } = new API(req, res)
        let Auth = new APIAuth(req, res)

        let { body } = req
        GET(
                await Auth.getAdmin("teacher"),
                async () => {
                        // list courses
                        let user_id = await Auth.UserId()
                        user_id = user_id?._id?.toString()
 
                        let data = await Courses.find({ teacher: { $in: [user_id] }, completion: false })
                                .select("title url image ") 
                        Send(data)
                });
}
