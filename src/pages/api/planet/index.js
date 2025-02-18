import { APIAuth } from "@/lib/app";
import { Planet } from "@/lib/models";
import API from "nextjs-vip";

export default async function api_admin_planet(req, res, next) {
    let app = new API(req, res);

    // API: GET / (للعامة)
    app.get(async () => {
        let planets = await Planet.find({})

        //.sort({ _id: -1 });
        app.Send(planets);
    });
    if (req.method === "POST") {
        let Auth = new APIAuth(req, res);
        // API: POST / (للمسؤول فقط)
        app.post(await Auth.getAdmin("admin"), async () => {
            let { image, name, description, courses, active } = req.body;
            if (!image || !name || !description || !courses) {
                return app.SendError(400, "Missing required fields.");
            }
            let newPlanet = await Planet.create({
                image, name, description, courses, active
            });
            app.Send(newPlanet);
        });
    }
}