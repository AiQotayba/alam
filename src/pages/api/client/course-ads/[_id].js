import { CourseAds } from "@/lib/models";
import API from "nextjs-vip";

export default async function api_course_ads_one(req, res, next) {
    let app = new API(req, res);
    app.get(async () => {
        let course = await CourseAds.findById(app.id);
        app.Send(course);
    });
} 