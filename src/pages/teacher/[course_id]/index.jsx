import { AuthServerSide } from "@/lib/app2";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export async function getServerSideProps(ctx) {
    return await AuthServerSide(ctx, 'teacher', async ({ NEXT_PUBLIC_API, config }) => {
        let url = `${NEXT_PUBLIC_API}/teacher/${ctx.query.course_id}`
        let { data } = await axios.get(url, config);
        return { data, config }
    })
}

export default function AdminUsers({ data }) {
    let route = useRouter()
    return (
        <section className=" p-10  page m-a">
            <div className="box col bord p-20 ">
                <h1 >{data?.title}</h1>
                <div className="box grid p-10 aitem mt-10">

                    <h3>الجلسات</h3>
                    <Link href={`${route.asPath}/add-session`} className="btn mx-10" >اضافة جلسة</Link>
                </div>
            </div>
            {/* sessions */}
            <div className=" box grid j">
            {data?.sessions?.map(session => (
                <Link href={`${route.asPath}/${session._id}`} className="card p-20 w-300 " key={session._id} style={{ border: `1px solid ${!session?.completion ? "#2196F3" : "#E91E63"}` }}>
                    {/* <img src={co.image} alt="" /> */}
                    <b>{session.title}</b>
                    <div className="box row space">
                        <p>{session?.time_start}</p>
                        <p>{session?.date_start}</p>
                    </div>
                </Link>
            ))}
            </div>
        </section>
    )
}
