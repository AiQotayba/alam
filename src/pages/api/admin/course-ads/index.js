import { APIAuth } from "@/lib/app";
import { CourseAds } from "@/lib/models";
import API from "nextjs-vip";

export default async function api_admin_course_ads(req, res, next) {
    let app = new API(req, res)
    let Auth = new APIAuth(req, res);

    app.get(await Auth.getAdmin("admin"), async () => {
        let courses = await CourseAds.find({}).select("-part -register -bio ").sort({ _id: -1 });
        app.Send(courses);
    });

    app.post(await Auth.getAdmin("admin"), async () => {

        let { date, title, price, bio, register, image, duration, phone } = req?.body;
        let data = await CourseAds.create({
            date, title, price, bio, register, phone, image, duration
        });
        app.Send(data);
    });
}
