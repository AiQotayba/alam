// family - ok
// list childs - ok
// list courses
// course
// info & avrage
// list attendants 

import CardAtt from "@/theme/card";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// last 5 attendants
export async function getServerSideProps(ctx) {
    return await AuthServerSide(ctx, 'family', async ({ NEXT_PUBLIC_API, config }) => {
        let url = `${NEXT_PUBLIC_API}/family`

        let { data } = await axios.get(url, config);
        return { props: { data, config } }
    })
}

export default function HomeFamily({ data: propsData }) {
    let [data, set] = useState(propsData)

    return (
        <div className="m-10">
            {/* List child data */}
            <h2 className="m-20">الاطفال</h2>
            <div className="box grid">
                {data?.childs.map(child => (
                    <Link href={`/family/${child?._id}`} className="aitem bord box col m-10 p-20" style={{ width: 150 }} key={child._id}>
                        <Image src={"/icons/user.svg"} width={60} height={60} alt="icon " />
                        <p className="p-10">{child?.name}</p>
                    </Link>
                ))}
            </div>
            {/* attendants details*/}
            <h2 className="m-20">التقييمات لاخر 10 ايام</h2>
            <div className="box grid">
                {data?.attendants.map(att => <CardAtt data={att} key={att._id} />)}
            </div>
        </div>
    )
}