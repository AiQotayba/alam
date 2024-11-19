import { Attendance, Child, User } from "@/lib/models";
import { API, APIAuth } from "@/lib/app";

export default async function FamilyHomeAPI(req, res) {
    let { GET, POST, Send } = new API(req, res);
    let Auth = new APIAuth(req, res);

    let { body } = req;

    GET(
        await Auth.getAdmin("family"),
        async () => {
            try {
                // Get user_id from Auth
                let userAuth = await Auth.UserId();
                if (!userAuth || !userAuth._id) {
                    throw new Error("User ID not found");
                }
                let user_id = userAuth._id.toString();

                // Get child's data
                let childs = await Child.find({});
                childs = childs.filter(c => c?.user_id?.toString() === user_id);

                // Get last 5 attendants
                let queryAtt = new Date().getTime() - 864000000;
                let attendants = await Attendance.find({ create_at: { $gt: queryAtt } })
                    .sort({ _id: -1 })
                    .populate("session_id")
                    .populate("child_id");

                // Filter attendants by user_id
                attendants = attendants.filter(
                    at => at?.child_id?.user_id?.toString() === user_id
                );

                // Get user coins
                let user = await User.findOne({ _id: user_id }).select("coins");
                if (!user) {
                    throw new Error("User not found");
                }

                // Initialize data
                let data = {
                    attendants,
                    childs,
                    coins: user.coins || 0,
                };

                Send(data);
            } catch (error) {
                console.error("Error in FamilyHomeAPI:", error);
                res.status(500).json({ error: error.message });
            }
        }
    );
}
