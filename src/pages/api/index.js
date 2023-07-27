import { Courses, User } from "@/lib/models";
import { API, APIAuth } from "@/lib/app";

export default async function users(req, res, next) {
    let { body, query } = req
    let { id, GET, Send } = new API(req, res)
    let Auth = new APIAuth(req, res)
    GET(
        async () => {
            let _id = await Auth.UserId()
            let courses = await Courses.find({ completion: false })

            let user = await User.findOne(_id)
            let typeUser = user?.typeUser
            Send({ typeUser, courses })
        }
    )

}
