import { APIAuth } from "@/lib/app";
import { CourseAds, User } from "@/lib/models";
import API from "nextjs-vip";

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb' // Set desired value here
        }
    }
}
export default async function api_admin_course_ads_one(req, res, next) {
    let app = new API(req, res);
    let Auth = new APIAuth(req, res);

    app.get(await Auth.getAdmin("admin"), async () => {
        let teacher1 = await User.find({ typeUser: "teacher" }).select("fullname phone ");
        let course = await CourseAds.findById(app.id).populate("teacher", "fullname phone ");
        app.Send({ course, teacher: teacher1 });
    });

    app.put(await Auth.getAdmin("admin"), async () => {
        let data = await CourseAds.findByIdAndUpdate(app.id, req?.body);
        app.Send({ data, msg: "تم تحديث اعلان الدورة" });
    });

    app.post(await Auth.getAdmin("admin"), async () => {
        let parts = await CourseAds.findById(app.id).select("part");
        let body = { part: [...parts.part, req?.body] };
        let data = await CourseAds.updateOne({ _id: app.id }, body);
        app.Send({ msg: "لقد تمت الاضافة الفقرة", data });
    });

    app.patch(await Auth.getAdmin("admin"), async () => {
        let body = { part: req?.body };
        let data = await CourseAds.updateOne({ _id: app.id }, body);
        app.Send({ msg: "لقد تمت تحديث الفقرات", data });
    });
 

    app.delete(await Auth.getAdmin("admin"), async () => {
        await CourseAds.deleteOne({ _id: app.id });
        app.Send({ msg: "لقد تم حذف الكورس" });
    });
}
