
import axios from "axios";
import Image from "next/image";
import { Contact } from "..";
import MarkdownIt from 'markdown-it'
import SEO from "@/theme/SEO";

export async function getServerSideProps(ctx) {
    let url = `${process.env.NEXT_PUBLIC_API}/client/course-ads/${ctx.query._id}`
    let { data } = await axios.get(url);
    return { props: { data } }
}
export default function CourseAdsView({ data, call = true }) {
    let md = new MarkdownIt()
    if (!data) return <center>Not Found </center>
    else {
        let part = data.part.sort((a, b) => a.Sort - b.Sort)
        return (
            <>
                <SEO title={data.title} description={data.bio} image={data.image} />
                <div className="box col page  m-a">
                    {/* info */}
                    <div className=" ">

                        <img src={data?.image || "/images/image-null.png"} alt="صورة تعريفية عن الدورة التدريبية " className="  p-0" style={{ width: '-webkit-fill-available', borderRadius: "20px" }} />
                        <h1 className="my-20 mx-10">{data.title} </h1>

                        <p className="my-20 mx-10">{data?.duration} </p>

                        <div className="box col w-full m-10">
                            <p className="my-10">{data.teacher?.map(a => "أ. " + a.fullname + " , ")} </p>
                        </div>
                        <div className="m-10 mb-20 p-10" dangerouslySetInnerHTML={{ __html: md.render(data?.bio) }} />
                        {/* join */}
                        {part?.map(a => <CardPart data={a} key={a._id} />)}
                        <b className="m-10">السعر </b>
                        <div className="box row bord p-10 space mt-20">

                            <p style={{ padding: '15px', fontSize: 'larger', fontFamily: 'system-ui', fontWeight: 'bold', color: '#0292ab' }}>   {data.price}$</p>
                            <a href={`https://api.whatsapp.com/send?phone=905380594084&text=${data.title}`} className="w-200 btn aitem p-5 " style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <Image src={`/icons/whatsapp2.svg`} width={30} height={30} alt="icon social media" />
                                <b className="mr-10">تواصل معنا</b>
                            </a>

                        </div>
                        <br />
                        {/* register */}
                        {data?.register ?
                            <>
                                <h3 className="m-20 ">فورم التسجيل</h3>
                                <iframe src={data?.register?.split(`src="`)[1].split(`"`)[0]} frameborder="0" marginheight="0" style={{
                                    width: '-webkit-fill-available',
                                    height: '-webkit-fill-available',
                                    minHeight: '600px'
                                }} marginwidth="0" loading="lazy" /></> : <></>}
                    </div>
                    {/* Follow links ar Contact */}
                </div>
                {call ? <Contact /> : <></>}
            </>
        )
    }
}
function CardPart({ data }) { 
    let md = new MarkdownIt()
    return (
        <div className={` type type-${data.typeView}`}>
            {data?.image ? <img src={data?.image} alt={`صورة ${data}`} /> : <></>}
            <div className="m-10">
                <h3 className="my-10" >{data.title}</h3>
                <p dangerouslySetInnerHTML={{ __html: md.render(data?.about) }} />
            </div>
        </div>
    )
}
