import { Courses, User } from "@/lib/models";
import { API, APIAuth } from "@/lib/app";

export default async function CoursesALL(req, res, next) {
        let { GET, POST, Send } = new API(req, res)
        let Auth = new APIAuth(req, res)
        let { body } = req
        GET(
                //       await  Auth.getAdmin("admin"),
                async () => {
                        let data = await Courses.find()
                                .populate('teacher', "fullname ")
                                .sort({ _id: -1 })
                        Send(data)
                });
        POST(
                async () => {

                        let data = {
                                title: body.title,
                                description: body.description,
                                image: body.image,
                                // date: {
                                // start: body.date.start,
                                // total: body.date.total,
                                // end: body.date.end,
                                // },
                                // count: {
                                        // coin: body?.count?.coin,
                                // }
                        }

                        await Courses.create(data)
                        Send({ msg: `تم اظافة  دورة  ${body.title}` })
                }
        )

}
