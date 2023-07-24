import { Child, User } from "@/lib/models";
import { API, APIAuth } from "@/lib/app";

export default async function users(req, res, next) {
        let { GET, PUT, PATCH, Send } = new API(req, res)
        let Auth = new APIAuth(req, res)

        GET(
                await Auth.getAdmin("admin"),
                async () => {
                        let users = await User.find().sort({ _id: -1 }).select('fullname email phone verification typeUser');
                        Send(users)
                });

        PATCH(
                await Auth.getAdmin("admin"),
                async () => {
                        let { phone, name } = req.query
                        let users = await User.find({ phone: { "$regex": phone } }).select("fullname phone")
                        let childs = await Child.find({ name: { "$regex": name } }).select("_id user_id name age")

                        const data = childs.map(child => {
                                const user = users.find(user => user._id.toString() === child.user_id.toString())
                                // return user
                                return {
                                        _id: child._id,
                                        fullname: user?.fullname,
                                        phone: user?.phone,
                                        name: child.name,
                                        age: child.age
                                };
                        });


                        Send(data)
                }
        )

}
