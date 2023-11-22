import { CourseAds, User } from "@/lib/models";
import { API, APIAuth } from "@/lib/app";

export default async function users(req, res, next) {
    let { body, query } = req
    let { id, GET, Send } = new API(req, res)
    let Auth = new APIAuth(req, res)
    GET(
        async () => {
            let _id = await Auth.UserId()
            let courses = await CourseAds.find() .select("create_at").sort({ _id: -1 })

        let { domain } = req.query
      
        function DATE(e) {
            if (e) {
                return new Date(e)?.toISOString().split('T')[0]
            } else return
        }
        courses=courses.map(a =>  {
        return {
                    url: `${domain}/course/${a._id}`,
                    lastmod: DATE(a?.create_at)
                }}
            )
 
            Send(  courses )
        }
    )

}
