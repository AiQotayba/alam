// family - ok
// list childs - ok
// list courses
// course
// info & avrage
// list attendants 

import { AuthServerSide } from "@/lib/app2";
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
        return { data, config }
    })
}

export default function HomeFamily({ data }) {

    let Coin = () => (<div className="bord p-10 w-300 m-a box row aitem space px-20 ">
        <p>النقاط  </p>
        <div className="box row aitem">
            <Image src={"/icons/coin.svg"} width={30} height={30} alt="icon " className="mx-10" />
            <b>  {data.coins}</b>
        </div>
    </div>)

    return (
        <div className="m-10">
            {/* List child data */}
            {data?.coins > 0 ? <Coin /> : <></>}
            {data?.childs?.length == 0 ? <div className="box col bord" >
                <h2>تصفح الدورات او تواصل مع الادارة</h2>
                <a href={`https://api.whatsapp.com/send?phone=905380594084&text=${data.title}`} className="w-200 btn aitem p-5 " style={{ display: 'flex', flexDirection: 'row', margin: '10px', alignItems: 'center' }}>
                    <Image src={`/icons/whatsapp2.svg`} width={30} height={30} alt="icon social media" />
                    <b className="mr-10">تواصل معنا</b>
                </a>
                <Link href={"/"} >تصفح الدورات</Link>
            </div> : ""}
            {data?.childs?.length > 0 ? <>

                <h2 className="m-20">الاطفال</h2>
                <div className="box grid">
                    {data?.childs.map(child => (
                        <Link href={`/family/${child?._id}`} className="aitem bord box col m-10 p-20" style={{ width: 150 }} key={child._id}>
                            <Image src={"/icons/user.svg"} width={60} height={60} alt="icon " className="px-10" />
                            <p className="p-10">{child?.name}</p>
                        </Link>
                    ))}
                </div>
                {/* attendants details*/}
                <h2 className="m-20">التقييمات لاخر 10 ايام</h2>
                <div className="box grid">
                    {data?.attendants.map(att => <CardAtt data={att} key={att._id} />)}
                </div>
            </>
                : <></>}
        </div>
    )
}