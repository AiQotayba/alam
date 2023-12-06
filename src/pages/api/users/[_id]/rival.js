import { User } from "@/lib/models";
import API from "nextjs-vip";
import { APIAuth } from "@/lib/app";
import bcrypt from 'bcrypt'

export default async function users(req, res, next) {
    let { body, query } = req
    let app = new API(req, res)
    let Auth = new APIAuth(req, res)
    
        app.put(await Auth.getAdmin('admin') ,async () => {
            let user = await User.findOne({_id:query }).select("")
            let rival =user.coins - body.coin 
              await User.updateOne({_id:query }, {coins:rival}) 
             
            app.Send({ msg: `تم خصم ${body.coin } نقطة ومتبقي ${rival } نقطة` })
        }) 
}
