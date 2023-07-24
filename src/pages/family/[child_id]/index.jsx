// family - ok
// list childs - ok
// list courses
// course
// info & avrage
// list attendants 

import { AuthServerSide } from "@/lib/app2";
import { CardCourse } from "@/lib/ui";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

// last 5 attendants
export async function getServerSideProps(ctx) {
    return await AuthServerSide(ctx, 'family', async ({ NEXT_PUBLIC_API, config }) => {
        let url = `${NEXT_PUBLIC_API}/family/${ctx.query.child_id}`

        let { data } = await axios.get(url, config);
        return { data, config } 
    })
}

export default function HomeFamily({ data: propsData }) {
    let [data, set] = useState(propsData)
    let ratingContext = ["غياب", "ضعيف جدا", "ضعيف", "معتدل", "جيد جدا", "ممتاز"]
    let route = useRouter()
    return (
        <div className="m-10">
            {/* List child data */}
            <h1 className="m-20">{data?.child?.name} </h1>
            <div className="box grid    " >
                {data?.courses?.map(co => (
                    <CardCourse data={co} slug={`${route.asPath}/`} key={co._id} />
                ))}
            </div>
        </div>
    )
}