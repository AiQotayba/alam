import { Service, User } from "@/lib/models";
import { API, APIAuth } from "@/lib/app";


export default async function ServiceApi(req, res, next) {
    let { body } = req
    let { GET, Send } = new API(req, res)
    let Auth = new APIAuth(req, res)

    GET(
        async () => {
            // add service 
            await User.findOneAndUpdate(
                { email: req.query.email, verificationCode: req.query.code },
                { verificationCode: 0, verification: true }
            ).then(user => {
                if (user) res.redirect(301, '/')
                else Send(user)
            })
        })
} 
