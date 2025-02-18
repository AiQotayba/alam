```js
/api/pass


export default async function auth(req, res, next) {

        let secret = process.env.secret || "dev"
        let userEmail = process.env.Email
        let pass = process.env.Pass
        let { body } = req
        let { GET, PUT, POST, PATCH, ALL, Send } = new API(req, res)
        let Auth = new APIAuth(req, res)
        let user_id = await Auth.UserId()

        const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: userEmail, pass } });
        GET(true, async () => {
                let { token } = req.headers
                let secret = process.env.secret || "dev"
                if (token) {
                        let detoken = await jwt.verify(token, secret)
                        let data = await User.findOne({ email: detoken.email })
                                .select('isAdmin isBlock permissions ')
                        let rouls = [...data.permissions, "user"]
                        data.isAdmin ? rouls.push("isAdmin") : ""
                        data.isBlock ? rouls.push("block") : ""
                        Send(rouls)

                } else Send({ data: false })
        })
        POST(
                await Auth.isLogin(),
                async () => {

                        const hash = await bcrypt.hash(body.password, 12)
                        let _user = await User.updateOne(user_id, { password: hash })
                        let token = jwt.sign({ email: body.email, _id: _user._id, }, secret)
                        let findEmail = await User.findOne(user_id)
                        // ---------
                        let ads = [{ title: "المستخدمين", url: "/admin/users" }]
                        let user = await User.findOne(user_id)

                        Send({ token, msg: "تم تغيير كلمة السر " })
                })
        // login build
        PUT(
                await Auth.isLogin(),
                async () => {
                        let user = await User.findOne(user_id)

                        let compare = await bcrypt.compare(body.password, user.password)
                        if (!compare) {
                                return Send({ error: 'المعلومات غير صحيحة' }, 200)
                        } else {
                                const hash = await bcrypt.hash(body.newpassword, 12)

                                await User.updateOne(user_id, { password: hash })

                                Send({ msg: "تم تحديث كلمة المرور" })
                        }

                })
        PATCH(async () => {
                let user = await User.findOne({ email: body.email })
                // send email
                let token = jwt.sign({ email: user.email, _id: user._id, }, secret)
                if (!user) Send({ msg: " الايميل غير صحيح " })

                else {
                        let urlV = `${process.env.NEXT_PUBLIC_API.slice(0, -4)}/auth/new-password?token=${token}`
                        let content = `
                <center>
                        <br/><br/>
                        <a href="${urlV}"  style="background-color: #0292ab; padding: 10px; color: #fff; text-decoration: none; margin: 0 auto; width: 150px; text-align: center; display: block; font-size: 15px;">  اعادة تعيين كلمة السر </a>
                </center>
                `
                        const mailOptions = {
                                from: userEmail,
                                to: user.email,
                                subject: "رابط اعادة تعيين كلمة السر ",
                                html: content
                        };
                        try {
                                const info = await transporter.sendMail(mailOptions);
                                // this code
                                Send({ msg: "تم ارسال رابط اعادة التعيين بنجاح", state: true })
                        } catch (error) {
                                res.status(500).json({ error: 'Failed to send email' });
                        }
                        // this code
                }
        })
        ALL(async () => {
                // auth
                // tocken user or token repassword
                let password
                if (auth) {
                        let compare = await bcrypt.compare(body.password, findEmail.password)
                        if (!compare) {
                                return Send({ msg: 'كلمة السر القديمة غير صحيحة' }, 400)
                        } else {
                                password = await bcrypt.hash(body.newpassword, 12)
                                Send({ msg: " تم تغيير كلمة السر" })
                        }
                } else {
                        password = await bcrypt.hash(body.newpassword, 12)
                        Send({ msg: " تم تغيير كلمة السر" })

                }

                await User.updateOne({ email: body.email }, { password: hash, })
                // email send message
                // this code
                Send({ state: true })

        })
}



```

```js
\src\pages\api\client\course-ads\index.js

export default async function api_course_ads(req, res, next) {
    let app = new API(req, res);
    app.get(async () => {
        let courses = await CourseAds.find({ display: true })
            .select("-part -register -bio ")
            .sort({ sort: 1 });
        app.Send(courses);
    });
}
D:\projects\alam-app\alam-admin\src\pages\api\client\course-ads\[_id].js
export default async function api_course_ads_one(req, res, next) {
    let app = new API(req, res);
    app.get(async () => {
        let course = await CourseAds.findById(app.id);
        app.Send(course);
    });
} 
D:\projects\alam-app\alam-admin\src\pages\api\courses\index.js
export default async function CoursesALL(req, res, next) {
        let { GET, POST, Send } = new API(req, res)
        let Auth = new APIAuth(req, res)
        let { body } = req
        GET(
                // await Auth.getAdmin("admin"),
                async () => {
                        let data = await Courses.find()
                                .populate('teacher', "fullname ")
                                .sort({ _id: -1 })
                        Send(data)
                });
} 
D:\projects\alam-app\alam-admin\src\pages\api\courses\[_id]\session.js

 
 import bcrypt from 'bcrypt'

export default async function CoursesOne(req, res, next) {
    let { body, query } = req
    let { GET, id, PATCH, POST, ALL, DELETE, PUT, Send } = new API(req, res) 
    GET(async () => {
        let { session_id } = query
        let session = await Session.findOne({ _id: session_id }).populate("teacher_id")
        let atten = await Attendance.find().populate("child_id")
        let attendance = atten.filter(a => a.session_id.toString() == session_id)

        let user_id = attendance.map(a => a.child_id.user_id)
        let users = await User.find({ _id: { $in: user_id } }).select("_id fullname phone")

        attendance = await Promise.all(attendance.map(async a => {
            let user = await users.filter(b => a.child_id.user_id.toString() === b._id.toString())[0]
            let data = {
                name: a.child_id.name,
                fullname: user?.fullname,
                phone: user?.phone,
                feedback: a?.feedback,
                absence: a?.absence
            }

            return data
        }))
        Send({
            session,
            attendance
        })
    })
    // add student
    POST(async () => {

        let { title, time_start, date_start,teacher_id } = body
        let NEW = {
            course_id: query._id,
            title, time_start, date_start ,teacher_id

        }
        let a = await Session.create(NEW)
        let data = await Session.findOne({_id:a._id}).populate("teacher_id", "fullname phone ")
        Send({ msg: "تم اضافة الجلسة", data })
    })

    DELETE(async () => {
        let { session_id } = query
        let co = await Session.deleteOne({ _id: session_id }).select("students")
        let students = co.students?.filter(a => a.toString() !== students_id)
        await Courses.updateOne(id, { students })

        Send({ msg: "تم حذف الجلسة" })
    })
    
}

```

```js

D:\projects\alam-app\alam-admin\src\pages\api\family\index.js


  
 
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

D:\projects\alam-app\alam-admin\src\pages\api\family\[child_id]\index.js
 
 
export default async function CoursesALL(req, res, next) {
        let { GET, POST, Send } = new API(req, res)
        let Auth = new APIAuth(req, res)

        let { body, query } = req
        GET(
                await Auth.getAdmin("family"),
                async () => {
                        // list childs
                        let child = await Child.findOne({ _id: query.child_id })
                        //  my courses
                        let courses = await Courses.find({ students: { $in: [query.child_id] } }).select("completion title image ")
                        // init data
                        let data = { child, courses }

                        Send(data)


                });


}

D:\projects\alam-app\alam-admin\src\pages\api\family\[child_id]\[course_id].js
 
 
export default async function CoursesALL(req, res, next) {
    let { GET, POST, Send } = new API(req, res)
    let Auth = new APIAuth(req, res)

    let { body, query } = req
    GET(
        await Auth.getAdmin("family"),
        async () => {
            let { child_id, course_id } = query
            // info 
            let course = await Courses.findOne({ _id: course_id })
                .select("title image teacher completion description ")
                .populate("teacher", "fullname")

            // list attendants
            let attendants = await Attendance.find({ child_id })
                .populate("session_id")
                .populate("child_id")

            //  avrage
            let data = {
                course,
                attendants
            }

            Send(data)
        });
}

```

```js

D:\projects\alam-app\alam-admin\src\pages\api\teacher\index.js



export default async function TeacherHmoeApi(req, res, next) {
        let { GET, POST, Send } = new API(req, res)
        let Auth = new APIAuth(req, res)

        let { body } = req
        GET(
                await Auth.getAdmin("teacher"),
                async () => {
                        // list courses
                        let user_id = await Auth.UserId()
                        user_id = user_id?._id?.toString()
 
                        let data = await Courses.find({ teacher: { $in: [user_id] }, completion: false })
                                .select("title url image ") 
                        Send(data)
                });
}


D:\projects\alam-app\alam-admin\src\pages\api\teacher\[course_id]\index.js


export default async function CoursesALL(req, res, next) {
    let { GET, Send } = new API(req, res)
    let Auth = new APIAuth(req, res)

    let { body, query } = req
    GET(
        await Auth.getAdmin("teacher"),
        async () => {
            let { course_id } = query
            // course & sessions
            let co = await Courses.findOne({ _id: course_id })
            let sessions = await Session.find({ course_id })
            let teacher_id = await Auth.UserId()

            sessions = sessions.filter(a => a.teacher_id == teacher_id?._id.toString())
            // console.log({sessions});
            sessions.sort((a, b) => {
                const dateA = new Date(a.date_start);
                const dateB = new Date(b.date_start);
                return dateA - dateB;
            });

            Send({
                title: co.title,
                sessions,
            })
        });
}
D:\projects\alam-app\alam-admin\src\pages\api\teacher\[course_id]\[session_id].js


export default async function CoursesALL(req, res, next) {
    let { GET, POST, PUT, DELETE, Send } = new API(req, res)
    let Auth = new APIAuth(req, res)

    let { body, query } = req
    let { course_id, session_id } = query
    GET(
        await Auth.getAdmin("teacher"),
        async () => {
            //  list student 
            let co = await Courses.findOne({ _id: course_id }).select(" title students")

            let allStudents = await Child.find({ _id: co.students })
                .select("name age user_id")
                .populate("user_id", "fullname")
            let session = await Session.findOne({ _id: session_id })
            let students = []
            let attendants = await Attendance.find({ session_id })
            allStudents.map(a => {
                let find = attendants.filter(b => a._id.toString() === b.child_id.toString())
                if (find.length === 0) students.push(a)
            })
            let data = {
                title: co.title,
                session,
                students,
                attendants
            }
            // let se = await Attendance.find({ session_id }).select("_id") 
            Send({ ...data, co: co.students })
        });
    POST(
        await Auth.getAdmin("teacher"),
        async () => {
            // create session
            // ok
            let teacher_id = await Auth.UserId()

            let { title, time_start, date_start } = body
            let data = {
                course_id,
                title, time_start, date_start, teacher_id: teacher_id?._id.toString()
            }
            console.log(data);
            let NEW = await Session.create(data)
            Send({
                msg: "تم اضافة الجلسة",
                NEW
            })
        }
    )
    PUT(
        await Auth.getAdmin("teacher"),
        async () => {

            // add  feedback student
            let { child_id, feedback, absence } = body

            let data = {
                child_id,
                session_id,
                feedback,
                absence
            }
            let child = await Child.findOne({ _id: child_id }).populate('user_id')
            await Attendance.create(data)
            let co = await Courses.findOne({ _id: course_id }).select("students")
            let se = await Attendance.find({ session_id })
            if (co.students.length - 1 == se.length) {
                await Session.updateOne({ _id: session_id }, { completion: true })
            }
            // await Attendance.deleteMany()
            Send({ msg: `تم اضافة الحضور ${child.name} ${child.user_id?.fullname}` })

        }
    )
    DELETE(
        await Auth.getAdmin("teacher"),
        async () => {
            await Session.deleteOne({ _id: session_id })
            Send({ msg: "تم حذف الجلسة" })
        }
    )
}

