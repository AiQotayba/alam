import { CourseAds } from "@/lib/models";
import API from "nextjs-vip";

export default async function users(req, res, next) {
    let { body, query } = req
    let app = new API(req, res)
    app.get(
        async () => {
            let courses = await CourseAds.find({ display: true }).select("create_at").sort({ _id: -1 })

            let { domain } = req.query

            function DATE(e) {
                if (e) return new Date(e)?.toISOString().split('T')[0]
                else return
            }
            courses = courses.map(a => {
                return {
                    url: `${domain}/course/${a._id}`,
                    lastmod: DATE(a?.create_at)
                }
            }
            )

            app.Send(courses)
        }
    )

}
