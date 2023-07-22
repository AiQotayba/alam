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
                        let emails = body.teacher?.split(",").map(a => a.trim())
                        console.log(emails);
                        let ids = await User.find({ email: { $in: emails } }).select("_id")
                        ids = ids.map(a => a._id)

                        let data = {
                                teacher: ids,
                                title: body.title,
                                description: body.description,
                                url: body.url,
                                image: body.image,
                                // date: {
                                // start: body.date.start,
                                // total: body.date.total,
                                // end: body.date.end,
                                // },
                                count: {
                                        coin: body?.count?.coin,
                                        session: body?.count?.session,
                                }
                        }

                        await Courses.create(data)
                        Send({ msg: `تم اظافة  دورة  ${body.title}` })
                }
        )

}
