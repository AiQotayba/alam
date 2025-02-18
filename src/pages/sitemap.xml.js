import axios from "axios";
import sitemap from "nextjs-vip/sitemap"

export async function getServerSideProps({ res }) {
    let { NEXT_PUBLIC_API } = process.env
    await axios.get(`${NEXT_PUBLIC_API}?domain=${NEXT_PUBLIC_API.replace("/api", "")}`, {})
        .then(({ data }) => {
        
        return sitemap(res,[{ url: NEXT_PUBLIC_API.replace("/api", "") }, ...data])
            }
        )
    return { props: {} }
}

export default function s() { }
