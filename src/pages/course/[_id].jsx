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
        <>
            <div className="box col page  m-a">
                {/* info */}
                <div className="bord">

                    <img src={data.image} alt="صورة تعريفية عن الكورس " className="  p-0" style={{ width: '-webkit-fill-available', borderRadius: "20px" }} />
                    <h1 className="my-20 mx-10">{data.title} </h1>
                    <div className="box col w-full m-10">
                        <p className="my-10">{data.teacher?.map(a => a.fullname + " , ")} </p>
                        <p className="my-10">{data.price}$</p>
                    </div>
                    {/* join */}
                    <div className="box  col">
                        <p>
                            {/* <span>{data.date?.start}</span>
                            <span>{data.date?.end}</span> */}
                        </p>
                    </div>
                    <div className="box w-full" style={{ justifyContent: 'flex-end' }}>
                        <button className="w-200 aitem p-5 " style={{ display: 'flex', flexDirection: 'row', margin: '10px', alignItems: 'center' }}>
                            <Image src={`/icons/whatsapp2.svg`} width={30} height={30} alt="icon social media" />
                            <b className="mr-10">تواصل معنا</b>
                        </button>
                    </div>
                    {/* about */}
                    <div className="  m-10 " dangerouslySetInnerHTML={{ __html: data.description }} />
                </div>
                {/* Follow links ar Contact */}
            </div>
            <Contact />
        </>
    )
}