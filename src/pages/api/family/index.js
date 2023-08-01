import { Attendance, Child, Courses, Session, User } from "@/lib/models";
import { API, APIAuth } from "@/lib/app";
import mongoose from "mongoose";

export default async function FamilyHomeAPI(req, res, next) {
        let { GET, POST, Send } = new API(req, res)
        let Auth = new APIAuth(req, res)

        let { body } = req
        GET(
                await Auth.getAdmin("family"),
                async () => {
                        // list childs
                        let user_id = await Auth.UserId()
                        user_id = user_id?._id?.toString()
                        let childs = await Child.find({})
                        childs = await childs?.filter(c => {
                                // console.log([c.user_id.toString(), user_id])
                                return c.user_id.toString() === user_id
                        })

                        // last 5 attendants
                        let queryAtt = new Date().getTime() - 864000000
                        let attendants = await Attendance
                                .find({ create_at: { $gt: queryAtt } })
                                .sort({ _id: -1 })
                                // .select("feedback rating create_at child_id session_id")
                                .populate("session_id")
                                .populate("child_id")
                        attendants = attendants?.filter(at => at.child_id.user_id.toString() === user_id)
                        let user = await User.findOne({ _id: user_id }).select("coins")
                        // init data 
                        let data = {
                                attendants,
                                childs,
                                coins: user.coins
                        }
                        Send(data)


                });


}
