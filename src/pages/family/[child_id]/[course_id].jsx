// family - ok
// list childs - ok
// list courses - ok
// course
// info & avrage
// list attendants 

import { AuthServerSide } from "@/lib/app2";
import { CardCourse } from "@/lib/ui";
import CardAtt from "@/theme/card";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

// last 5 attendants
export async function getServerSideProps(ctx) {
    return await AuthServerSide(ctx, 'family', async ({ NEXT_PUBLIC_API, config }) => {
        let { query } = ctx
        let url = `${NEXT_PUBLIC_API}/family/${query.child_id}/${query.course_id}`

        let { data } = await axios.get(url, config);
        return { props: { data, config } }
    })
}

export default function HomeFamily({ data: propsData }) {
    let [data, set] = useState(propsData)
    let [avrage, setAv] = useState(() => {
        let listRating = data?.attendants?.map(a => a?.rating);
        console.log(listRating);
        const totalMarks = listRating?.reduce((sum, mark) => sum + mark, 0);
        return Math.round(totalMarks / listRating?.length)
        return 0
    })
    let ratingContext = ["غياب", "ضعيف جدا", "ضعيف", "معتدل", "جيد جدا", "ممتاز"]
    let route = useRouter()
    let { course } = data
    return (
        <div className="m-10">
            <div className="bord box col page " >
                <img src={course?.image} alt="" className="box center bord m-0 p-0" />
                <span className="bord " style={{
                    margin: '10px',
                    width: '100px',
                    padding: '10px',
                    position: 'absolute',
                    textAlign: 'center',
                    color: '#0292ab'
                }} >{!course?.completion ? "مستمرة" : "انتهت"}</span>
                <h1 className="m-20">{course?.title} </h1>
                <b className="m-10">
                    {course?.teacher?.map(a => (
                        <span key={a._id}>{a.fullname}</span>
                    ))}
                </b>
                <p className="m-10">{course?.description} </p>
                <p className="m-10">مستوى الطالب<span className="color"> {ratingContext[avrage]}</span></p>
            </div>
            {/* Attendant List */}
            <div className="box grid ">
                {data?.attendants?.map(att => <CardAtt data={att} key={att._id} />)}
            </div>
        </div>
    )
}