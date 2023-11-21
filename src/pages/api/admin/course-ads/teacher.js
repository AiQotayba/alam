import { APIAuth } from "@/lib/app";
import { CourseAds } from "@/lib/models";
import API from "nextjs-vip";

export default async function api_admin_course_ads(req, res, next) {
    let app = new API(req, res)
    let Auth = new APIAuth(req, res);
 

    app.put(await Auth.getAdmin("admin"), async () => { 
        let one = await CourseAds.findOne({ _id: app.id }).select("teacher");
        let daaa
        if (req.body.type == "post") daaa = [...one.teacher, req.body._id]
        else daaa = one.teacher?.filter(a => a._id != req.body._id)
        let data = await CourseAds.updateOne({ _id: app.id }, { teacher: daaa });
        let text = req.body.type == "post" ? "اضافة":"حذف "
        app.Send({ msg: `لقد تم ${text} المعلمة `, data });
    });  
}
