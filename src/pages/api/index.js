import { Courses, User } from "@/lib/models";
import { API, APIAuth } from "@/lib/app";

export default async function users(req, res, next) {
    let { body, query } = req
    let { id, GET, Send } = new API(req, res)

    GET(
        async () => {
            let users = await Courses.find({ completion: false })
            Send(users)
        }
    )

}
