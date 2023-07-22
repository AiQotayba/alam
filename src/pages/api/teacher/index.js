import { Child, Courses, Session, User } from "@/lib/models";
import { API, APIAuth } from "@/lib/app";

export default async function CoursesALL(req, res, next) {
        let { GET, POST, Send } = new API(req, res)
        let Auth = new APIAuth(req, res)

        let { body } = req
        GET(
                //       await  Auth.getAdmin("admin"),
                async () => {
                        // list courses
                        let { types, url } = req.query

                        let user_id = "64996c99ec9e55b4ba0a4ac1"
                        let data = await Courses.find({ teacher: { $in: [user_id] }, completion: false })
                                .select("title url image ")
                        Send(data)


                });
        POST(
                async () => {

                        Send({ msg: `تم اظافة  دورة  ${body.title}` })
                }
        )

}
/**
 * /teacher
 *      @GET 
 * attendants
كتابة تقييم كل طالب
complete and add date session
 */