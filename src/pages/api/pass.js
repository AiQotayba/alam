import { User } from "@/lib/models";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { API, APIAuth } from "@/lib/app";
import nodemailer from 'nodemailer';

/**
* 
* @route {"/auth"}  
* @method {POST} signup   
* @method {PUT} login   
* 
*/

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
                        console.log(user)
                        console.log(body.password, user.password)

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
                                console.log('Error:', error);
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
                        console.log(body.password, findEmail.password)
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










