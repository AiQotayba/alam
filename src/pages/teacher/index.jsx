import { AuthServerSide } from "@/lib/app2";
import { CardCourse } from "@/lib/ui";
import axios from "axios";

export async function getServerSideProps(ctx) {
    return await AuthServerSide(ctx, 'teacher', async ({ NEXT_PUBLIC_API, config }) => {
        let url = `${NEXT_PUBLIC_API}/teacher?types=courses`
        let { data } = await axios.get(url, config);
        return { data, config }
    })
}

export default function AdminUsers(props) {

    return (
        <section className="box col m-20">
            <h1 className=" p-20">الكورسات</h1>
            <div className="box grid  aitem">

                {props.data?.map(co => (
                    <CardCourse data={co} slug="/teacher/" key={co._id} />
                ))}
            </div>
        </section>
    )
}
