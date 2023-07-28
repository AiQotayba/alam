import { SSRctx } from "@/lib/app2";
import { CardCourse } from "@/lib/ui";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { Contact } from "..";

export async function getServerSideProps(ctx) {
    let url = `${process.env.NEXT_PUBLIC_API}/courses/all?_id=${ctx.query._id}`
    let { data } = await axios.get(url);
    return { props: { data } }
}
export default function Home({ data }) {
    return (
        <div className="box col page bord">
            {/* info */}
            <img src={data.title} alt="صورة تعريفية عن الكورس " />
            <h1>{data.title} </h1>
            <div className="box row w-full">
                <p>{data.teacher.fullname} </p>
                <p>{data.price} </p>
                {/* join */}
                <div className="box  row">
                    <p>
                        <span>{data.date.start}</span>
                        <span>{data.date.end}</span>
                    </p>
                    <button>
                        <Image src={`/icons/whatsapp.svg`} width={40} height={40} alt="icon social media" />
                        <p className="ml-10">تسجيل</p>
                    </button>
                </div>
            </div>

            {/* about */}
            <div className="bord page" dangerouslySetInnerHTML={{ __html: data.description }} />
            {/* Follow links ar Contact */}
            <Contact />
        </div>
    )
}