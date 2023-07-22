import axios from "axios"

export default async function Auth(token) {
    if (token) {
        let URLs = `${process.env.NEXT_PUBLIC_API}/auth`
        let config = { headers: { token } }
        return axios.get(URLs, config)
            .then(({ data }) => (data))
    }
    else return false
}
export async function AuthServerSide(ctx, authString, fun) {
    let { NEXT_PUBLIC_API } = process.env
    let { cookies, query, config, token } = SSRctx(ctx)
    let auth = await Auth(token)
    if (auth === false) return { redirect: { permanent: false, destination: '/auth/login' } }
    else {
        let authif = auth?.filter(a => a === authString)
        if (authif.length > 0) {
            try {
                if (typeof fun === 'function') {
                    let data = await fun({ cookies, query, config, NEXT_PUBLIC_API })
                    return { props: { ...data, config } }
                }
            } catch (err) {
                return { redirect: { permanent: false, destination: '/auth/login' } }
            }
        } else return { redirect: { permanent: false, destination: '/auth/login' } }
    }
}
export function SSRctx(ctx) {
    let { cookies } = ctx.req
    let query = ctx.query
    let { token } = cookies
    let config = { headers: { token: cookies?.token } }
    return { cookies, token, query, config }
}
export function open(q) {
    document.querySelector(q).classList.toggle('none')
}
