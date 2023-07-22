import { User } from "@/lib/models";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { API } from "@/lib/app";
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
        const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: userEmail, pass } });
        GET(true, async () => {
                let { token } = req.headers
                let secret = process.env.secret || "dev"
                if (token) {
                        let detoken = await jwt.verify(token, secret)
                        let data = await User.findOne({ email: detoken.email })
                                .select('typeUser ')

                        Send(data.typeUser)
                } else Send({ data: false })
        })
        POST(async () => {
                let findEmail = await User.findOne({ email: body.email.toLowerCase() })
                if (findEmail) {
                        return Send({ error: 'Email already exists' }, 204)
                } else {
                        const hash = await bcrypt.hash(body.password, 12)
                        let data = {
                                fullname: body.fullname,
                                phone: body.phone,
                                email: body.email.toLowerCase(),
                                password: hash,
                                verificationCode: Number(Math.random().toString().slice(2, 7))
                        }
                        
                        Math.random()
                        let _user = await User.create(data)
                        let token = jwt.sign({ email: body.email, _id: _user._id, }, secret)
                        // email verification
                        let urlV = `${process.env.NEXT_PUBLIC_API}/verification?email=${encodeURI(body.email)}&code=${data.verificationCode}`
                        let content = `
                        <center>
                        <b > التحقق من الايميل ${body.email}</b>
                        <br/>
                       <a href="${urlV}"  style="background-color: #0292ab; padding: 10px; color: #fff; text-decoration: none; margin: 0 auto; width: 150px; text-align: center; display: block; font-size: 20px;"> التحقق الان </a>
                       </center>
                        `
                        const mailOptions = {
                                from: userEmail,
                                to: _user.email,
                                subject: "التحقق من الايميل",
                                html: content
                        };

                        try {
                                const info = await transporter.sendMail(mailOptions);
                                // this code
                                Send({ token })
                        } catch (error) {
                                console.log('Error:', error);
                                res.status(500).json({ error: 'Failed to send email' });
                        }
                }
        })
        // login build
        PUT(async () => {
                let findEmail = await User.findOne({ email: body.email.toLowerCase() })
                if (findEmail) {

                        let compare = await bcrypt.compare(body.password, findEmail.password)
                        if (!compare) {
                                return Send({ error: 'المعلومات غير صحيحة' }, 200)
                        } else {
                                let token = jwt.sign({ email: body.email.toLowerCase(), _id: findEmail._id, }, secret)
                                Send({ token, admin: findEmail.isAdmin })
                        }
                } else return Send(res, { error: 'المعلومات غير صحيحة' }, 200)
        })

}










