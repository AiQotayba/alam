import { Courses, User } from "@/lib/models";
import { API, APIAuth } from "@/lib/app";
 
export default async function CoursesOne(req, res) {
    let { body, query } = req;
    let { GET, POST, DELETE, Send } = new API(req, res);
    let Auth = new APIAuth(req, res);

    // GET: Fetch teachers not assigned to the course
    GET(
        await Auth.getAdmin("admin"),
        async () => {
            try {
                const filter = { typeUser: "teacher" };

                if (query.fullname) {
                    filter.$or = [
                        { fullname: { $regex: new RegExp(query.fullname, "i") } },
                        { phone: { $regex: new RegExp(query.phone.toLowerCase(), "i") } }
                    ];
                }

                const users = await User.find(filter).select("fullname phone email");
                const course = await Courses.findById(query._id).select("teacher");

                const data = users.filter(user => 
                    !course.teacher.some(teacherId => teacherId.toString() === user._id.toString())
                );

                Send(data);
            } catch (error) {
                console.error("Error fetching teachers:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        }
    );

    // POST: Add a teacher to the course
    POST(
        await Auth.getAdmin("admin"),
        async () => {
            try {
                const { teacher_id } = body;
                const course = await Courses.findById(query._id).select("teacher");

                if (!course.teacher.includes(teacher_id)) {
                    course.teacher.push(teacher_id);
                    await course.save();
                }

                const updatedCourse = await Courses.findById(id).select("teacher");
                Send(updatedCourse);
            } catch (error) {
                console.error("Error adding teacher:", error);
                res.status(500).json({ error: "Failed to add teacher" });
            }
        }
    );

    // DELETE: Remove a teacher from the course
    DELETE(
        await Auth.getAdmin("admin"),
        async () => {
            try {
                const { teacher_id } = query;
                const course = await Courses.findById(id).select("teacher");

                course.teacher = course.teacher.filter(tid => tid.toString() !== teacher_id);
                await course.save();

                Send({ msg: "تم حذف المعلمة" });
            } catch (error) {
                console.error("Error deleting teacher:", error);
                res.status(500).json({ error: "Failed to remove teacher" });
            }
        }
    );
}
