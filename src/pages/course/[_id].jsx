 
import axios from "axios"; 
import Image from "next/image";  
import { Contact } from "..";
import MarkdownIt from 'markdown-it'
export async function getServerSideProps(ctx) {
    let url = `${process.env.NEXT_PUBLIC_API}/courses/all?_id=${ctx.query._id}`
    let { data } = await axios.get(url);
    return { props: { data } }
}
export default function Home({ data }) {
    let md = new MarkdownIt() 

    return (
        <>
            <div className="box col page  m-a">
                {/* info */}
                <div className="bord">

                    <img src={data?.image || "/images/image-null.png"} alt="صورة تعريفية عن الدورة التدريبية " className="  p-0" style={{ width: '-webkit-fill-available', borderRadius: "20px" }} />
                    <h1 className="my-20 mx-10">{data.title} </h1>
                    <div className="box col w-full m-10">
                        <p className="my-10">{data.teacher?.map(a => "أ. " + a.fullname + " , ")} </p>
                    </div>
                    {/* about */}
                    <h2>الوصف</h2>
                    <div className="m-10 mb-20 p-10" dangerouslySetInnerHTML={{ __html: md.render(data?.description || '') }} />
                    {/* join */}
                    <b className="m-10">السعر </b>
                    <div className="box row bord p-10 space mt-20">

                        <p style={{padding: '15px',fontSize: 'larger',fontFamily: 'system-ui',fontWeight: 'bold',color: '#0292ab'}}>   {data.price}$</p> 
                            <a href={`https://api.whatsapp.com/send?phone=905380594084&text=${data.title}`} className="w-200 btn aitem p-5 " style={{ display: 'flex', flexDirection: 'row',  alignItems: 'center' }}>
                                <Image src={`/icons/whatsapp2.svg`} width={30} height={30} alt="icon social media" />
                                <b className="mr-10">تواصل معنا</b>
                            </a> 

                    </div>
                </div>
                {/* Follow links ar Contact */}
            </div>
            <Contact />
        </>
    )
}
