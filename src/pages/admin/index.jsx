import { AuthServerSide } from "@/lib/app2";
import Image from "next/image";
import Link from "next/link";

export async function getServerSideProps(ctx) {
    return await AuthServerSide(ctx, 'admin', async () => {
        return {}
    })
}

export default function AdminPage() {
    return (
        <div className="box col p-20 m-10  ">
            <h2 className="px-20 py-10">الاقسام</h2>
            <div className="box grid">
                <Part URL={"users"} Title={"المستخدمين"} icon={"users.svg"} />
                <Part URL={"courses"} Title={"الدورات التدريبية"} icon={"posts.svg"} />
                <Part URL={"course-ads"} Title={"اعلانات الدورات"} icon={"posts.svg"} />
            </div>
        </div>
    )
}
function Part({ URL, Title, icon }) {
    return (
        <Link href={`/admin/${URL}`} className="bord p-20 m-10  w-300 box row aitem">
            <Image src={`/icons/${icon}`} alt="icon" width={50} height={50} />
            <b className="p-20">{Title}</b>
        </Link>
    )
}