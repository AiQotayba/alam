import { Courses, User } from "@/lib/models";
import { API, APIAuth } from "@/lib/app";
import bcrypt from 'bcrypt'

export default async function CoursesOne(req, res, next) {
    let { body, query } = req
    let { GET, id, POST, DELETE, Send } = new API(req, res)
    let Auth = new APIAuth(req, res)

    GET(
        await Auth.getAdmin("admin"),
        async () => {
            const filter = { typeUser: "teacher" }; // Filter by teacher type

            if (query.fullname) {
                filter.$or = [
                    { fullname: { $regex: new RegExp(query.fullname, "i") } },
                    { phone: { $regex: new RegExp(query.phone.toLowerCase(), "i") } },
                ];
            }

            const users = await User.find(filter).select("fullname phone email");

            // let users = await User.find({
            //     typeUser: { $in: ["teacher"] },
            //     $or: [
            //         { fullname: { $regex: query.fullname || "" } },
            //         { phone: { $regex: query.phone.toLowerCase() || "" } },
            //     ]
            // }).select("fullname phone email")
            let co = await Courses.findById(query._id).select("teacher")

            let data = []
            users.map(a => {
                let find = co?.teacher.filter(b => b.toString() == a?._id.toString())
                if (find.length == 0) data.push(a)
            })
            Send(data)

        }
    )
    // add student
    POST(
        await Auth.getAdmin("admin"),
        async () => {
            let _id = body.teacher_id
            let co = await Courses.findOne(id).select("teacher")
            co.teacher.push(_id)
            let teacher = co.teacher?.map(a => a._id.toString())
            teacher = Array.from(new Set(teacher))
            await Courses.updateOne(id, { teacher })
            let co2 = await Courses.findOne(id).select("teacher")
            Send(co2)
        }
    )

    DELETE(
        await Auth.getAdmin("admin"),
        async () => {
            let { teacher_id } = query
            let co = await Courses.findOne(id).select("teacher")
            let teacher = co.teacher?.filter(a => a.toString() !== teacher_id)
            await Courses.updateOne(id, { teacher })

            Send({ msg: "تم حذف المعلمة" })

        }
    )

}
