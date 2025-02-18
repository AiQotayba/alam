import { Child, User } from "@/lib/models";
import { API, APIAuth } from "@/lib/app"

export default async function auth(req, res, next) {

    let { body, q } = req
    let { GET, PUT, POST, DELETE, ALL, id, Send } = new API(req, res)
    let Auth = new APIAuth(req, res)
    let user_id = await Auth.UserId()

    GET(
        await Auth.getAdmin("admin"),
        async () => {
            let data = await Child.findOne(id)
            Send(data)
        })
    DELETE(
        await Auth.getAdmin("admin"),
        async () => {
            await Child.deleteOne(id)

            Send({ msg: "تم حذف الطفل" })
        }
    )

}
