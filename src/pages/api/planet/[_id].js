import { APIAuth } from "@/lib/app";
import { Planet, Course } from "@/lib/models";
import API from "nextjs-vip";

export default async function api_admin_planet(req, res, next) {
    let app = new API(req, res);
    const { _id } = req.query;

    // API: GET /[_id] (للعامة)

    if (req.method === "GET") app.get(async () => {
        const { _id } = req.query;
        if (!_id) {
            return app.SendError(400, "Missing planet ID.");
        }
        let planet = await Planet.findById(_id);
        let courses = await Course.find({ planet: _id })//.select("title teacher")
        if (!planet) {
            return app.SendError(404, "Planet not found.");
        }
        app.Send({ ...planet, courses });
    });
    if (req.method === "PUT") {
        // API: PUT /[_id] (للمسؤول فقط)
        let Auth = new APIAuth(req, res);
        app.put(await Auth.getAdmin("admin"), async () => {
            const { _id } = req.query;
            if (!_id) {
                return app.SendError(400, "Missing planet ID.");
            }

            let { image, name, description, courses, active } = req.body;
            let updatedPlanet = await Planet.findByIdAndUpdate(_id, {
                image, name, description, courses, active
            }, { new: true });

            if (!updatedPlanet) {
                return app.SendError(404, "Planet not found.");
            }

            app.Send(updatedPlanet);
        });
    } else if (req.method === "DELETE") {
        let Auth = new APIAuth(req, res);
        // API: DELETE /[_id] (للمسؤول فقط)
        app.delete(await Auth.getAdmin("admin"), async () => {

            if (!_id) {
                return app.SendError(400, "Missing planet ID.");
            }

            let deletedPlanet = await Planet.findByIdAndDelete(_id);
            if (!deletedPlanet) {
                return app.SendError(404, "Planet not found.");
            }

            app.Send({ message: "Planet deleted successfully." });
        });
    }
}
