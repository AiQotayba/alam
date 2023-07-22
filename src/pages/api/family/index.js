import { Attendance, Child, Courses, Session, User } from "@/lib/models";
import { API, APIAuth } from "@/lib/app";
import mongoose from "mongoose";

export default async function FamilyHomeAPI(req, res, next) {
        let { GET, POST, Send } = new API(req, res)
        let Auth = new APIAuth(req, res)

        let { body } = req
        GET(
                //       await  Auth.getAdmin("admin"),
                async () => {
                        // list childs
                        const user_id = "64996c99ec9e55b4ba0a4ac1";

                        let childs = await Child.find()
                        childs = childs?.filter(c => c.user_id.toString() === user_id)
                        let childs_id = childs?.map(c => c._id.toString())

                        // last 5 attendants
                        let queryAtt = new Date().getTime() - 864000000
                        let attendants = await Attendance
                                .find({ create_at: { $gt: queryAtt } })
                                // .select("feedback rating create_at child_id session_id")
                                .populate("session_id")
                                .populate("child_id")
                        attendants = attendants?.filter(at => at.child_id.user_id.toString() === user_id)
                        // init data 
                        let data = {
                                attendants,
                                childs,
                        }

                        Send(data)


                });


}
