import jwt from "jsonwebtoken";
import { User, connect } from "./models";
import Cookies from "js-cookie";

export function setChange(e, data, set) {
    let full_data = { ...data }
    let { name, value, attributes, files } = e.target

    let object = attributes?.object?.value
    if (object) {
        let el = { [name]: value }
        full_data[object] = { ...full_data[object] };
        Object.assign(full_data[object], el)
    } else if (name === "image") {
        const file = files[0];
        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => full_data[name] = reader.result

            reader.readAsDataURL(file);
        }


    } else full_data[name] = value

    return set(full_data)
}

export function Input(props) {
    return (
        <div className={`box col ${props.className}`}>
            <p className="p-10">{props.title}</p>
            <input type={props?.title ? props?.title : 'text'} {...props} />
        </div>
    )
}
export function Alert(msg, type = "asssa") {
    let EL = document.querySelector(".alert")
    EL.classList.remove("none")
    EL.classList?.add(type)
    EL.textContent = msg

    setTimeout(() => {
        EL.classList.add("none")
        EL.textContent = " "
        EL.classList?.remove(type)

    }, 10000)
}
export async function NotificationSend(user_id, context) {
    let data = await Notification.create({ user_id, context })

    // this code to sockit.io

    return data
}
export class Client {
    constructor() {

    }
    static headers() {
        return {
            headers: {
                token: Cookies.get('token')
            }
        }
    }
    static api(path) {
        return `${process.env.NEXT_PUBLIC_API}${path}`
    }
}
export class API {
    constructor(req, res) {
        this.req = req
        this.res = res
        this.id = { _id: req.query._id }
        this.GET = this.GET.bind(this)
        this.POST = this.POST.bind(this)
        this.PUT = this.PUT.bind(this)
        this.DELETE = this.DELETE.bind(this)
        this.PATCH = this.PATCH.bind(this)
        this.ALL = this.ALL.bind(this)
        this.Send = this.Send.bind(this)
    }
    // Methods
    req = this.req
    res = this.res
    async GET(auth, callback) {
        if (this.req.method === 'GET') {
            await connect();
            if (auth) {
                if (typeof callback === "function") callback()
                else auth()
            }
        }
    }
    async POST(auth, callback) {
        if (this.req.method === 'POST') {
            await connect();
            if (auth) {
                if (typeof callback === "function") callback()
                else auth()
            }
        };
    }
    async PUT(auth, callback) {
        if (this.req.method === 'PUT') {
            await connect();
            if (auth) {
                if (typeof callback === "function") callback()
                else auth()
            }
        };
    }
    async DELETE(auth, callback) {
        if (this.req.method === 'DELETE') {
            await connect();
            if (auth) {
                if (typeof callback === "function") callback()
                else auth()
            }
        };
    }
    async PATCH(auth, callback) {
        if (this.req.method === 'PATCH') {
            await connect();
            if (auth) {
                if (typeof callback === "function") callback()
                else auth()
            }
        };
    }
    async ALL(auth, callback) {
        await connect();
        if (this.req.method === 'ALL') {
            if (auth) {
                if (typeof callback === "function") callback()
                else auth()
            }
        };
    }
    // data manager
    id = this.id
    async Send(data, status = 200) {
        this.res.setHeader('Content-Type', 'application/json')
        this.res.setHeader('Access-Control-Allow-Origin', "*")
        this.res.setHeader('Access-Control-Allow-Credentials', true);
        this.res.setHeader('X-Requested-With', 'NEXTJS')
        this.res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
        this.res.status(status).json(data)
    }
}

export class APIAuth {
    constructor(req, res) {
        this.req = req
        this.res = res
        this.id = { _id: req.query._id }

        this._init = this._init.bind(this)
        this.UserId = this.UserId.bind(this)
        this.Send = this.Send.bind(this)

        this.isLogin = this.isLogin.bind(this)
        this.isAdmin = this.isAdmin.bind(this)
        this.getAdmin = this.getAdmin.bind(this)

    }
    async _init(req) {
        let { token } = req.headers
        let secret = process.env.secret || "dev"
        if (token) {
            let detoken = await jwt.verify(token, secret)
            let data = await User.findOne({ email: detoken.email })
                .select('-password -__v')
            return data
        } else return false
    }
    // testing start
    UserId() {
        return this._init(this.req)
            .then(config => {
                return { _id: config._id, email: config.email, }
            })
    }

    async getAdmin(permission) {
        return this._init(this.req)
            .then(async config => {
                if (await this.isAdmin() !== undefined || false) {
                    let user = config?.typeUser?.filter(a => a === permission)[0]
                    if (user != undefined) return true
                    else this.Send({ msg: "غير مصرح لك الدخول" })

                }
            })
    }

    // start code OK

    isLogin() {
        return this._init(this.req)
            .then(config => {
                if (config !== undefined || false) return true
                else this.Send({ msg: "الرجاء تسجيل الدخول" })
            })
    }

    isAdmin() {
        return this._init(this.req)
            .then(config => {
                if (this.isLogin()) {
                    if (config.isAdmin) return true
                    else this.Send({ msg: " غير مصرح لك بالدخول " })
                }
            })
    }

    async Send(data, status = 200) {
        this.res.setHeader('Content-Type', 'application/json')
        this.res.setHeader('Access-Control-Allow-Origin', "*")
        this.res.setHeader('Access-Control-Allow-Credentials', true);
        this.res.setHeader('X-Requested-With', 'NEXTJS')
        this.res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
        this.res.status(status).json(data)
    }
    // end code OK
}
