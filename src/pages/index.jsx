import { AuthServerSide } from "@/lib/app2";
import { CardCourse } from "@/lib/ui";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
export async function getServerSideProps(ctx) {
  // return await AuthServerSide(ctx, 'family', async ({ NEXT_PUBLIC_API, config }) => {
  let url = `${process.env.NEXT_PUBLIC_API}/`
  let { data } = await axios.get(url);
  return { props: { data } }
  // })
}
export default function Home({ data }) {
  return (
    <>
      {/* <Link href={'/admin'} className="center box btn w-300   m-a">لوحة التحكم</Link> */}
      {/* Hero */}
      {/* <Hero {...props} /> */}
      {/* Login or admin */}

      {/* Courses */}
      {data.map(co => <CardCourse data={co} key={co._id} />)}
      {/* Contact us and social media links  */}
      <Contact />
      <Links />
    </>
  )
}
function Hero({ config, data }) {
  return (
    <div className=" landing">
      <img src="/images/landing-hero.png" alt="" />
      <div className="box col m-10 info">
        <h1 > عالم المبدعين</h1>
        <p className="py-10">هل تبحث عن تعليم لطفلك </p>
        <Link href={"/auth/login"} className="btn w-100">login</Link>
      </div>
    </div>
  )
}
function Contact() {
  function Line({ slug, src, title }) {
    return (
      <Link href={slug} className="box row p-10 aitem " >
        <Image src={`/icons/${src}`} width={40} height={40} alt="icon  social media" />
        <p className="px-10">{title}</p>
      </Link>
    )
  }
  return (
    <div className=" page   center m-a  p-10  ">
      <div className="box col bord aitem">
        <h2 className="p-20 ">اتصل بنا</h2>
        {/* wa lb */}
        <div className="box col w-full  p-10">

          <Line slug={"https://api.whatsapp.com/send?phone=905380594084"} src={"whatsapp.svg"} title={" 905380594084"} />
          {/* wa tr */}
          <Line slug={"https://api.whatsapp.com/send?phone=905380594084"} src={"whatsapp.svg"} title={" 905380594084"} />
          {/* email */}
          <Line slug={"mailto:info@alamalmoubdien.com"} src={"email.svg"} title={"info@alamalmoubdien.com"} />

        </div>
      </div>
    </div>
  )
}
function Links() {
  function Con({ slug, src }) {
    return (
      <Link href={slug} >
        <Image src={`/icons/${src}`} width={40} height={40} alt="icon  social media" />
      </Link>
    )
  }
  return (
    <div className="box col bord m-10  aitem ">
      <h3>تابعينا على </h3>
      <div className="my-10 box row w-300 space">
        <Con slug="https://www.facebook.com/Alam.almoubdien/" src="fb.svg" />
        <Con slug="https://instagram.com/alam.almoubdien" src="insta.svg" />
        <Con slug="https://t.me/alamalmoubdien" src="t.svg" />
        <Con slug="https://twitter.com/almoubdien?s=08" src="twitter.svg" />
        <Con slug="https://youtube.com/channel/UCQVLTT_gQrGLgFxyjmHWa1Q" src="youtube.svg" />

      </div>
    </div>
  )
}