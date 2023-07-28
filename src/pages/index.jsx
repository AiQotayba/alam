import { SSRctx } from "@/lib/app2";
import { CardCourse } from "@/lib/ui";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export async function getServerSideProps(ctx) {
  let url = `${process.env.NEXT_PUBLIC_API}/`
  let SSR = await SSRctx(ctx)
  let { data } = await axios.get(url, SSR.config);
  return { props: { data } }
}
export default function Home({ data }) {
  useEffect(() => {
    if (data?.typeUser?.length > 0) {
      Cookies.set("typeUser", JSON.stringify(data.typeUser))
    }
  }, [])
  return (
    <>
      {/* <Link href={'/admin'} className="center box btn w-300   m-a">لوحة التحكم</Link> */}
      {/* Hero */}
      <Hero {...props} />

      {/* Login or admin */}

      {/* Courses */}
      <div className="box row scroll page m-a p-20 j">
        {data?.courses?.map(co => <CardCourse data={co} key={co._id} slug={"/course/"} />)}
      </div>
      {/* Contact us and social media links  */}
      <Contact />
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
export function Contact() {
  function Line({ slug, src, title }) {
    return (
      <Link href={slug} className="box row p-10 aitem  "  >
        <Image src={`/icons/${src}`} width={40} height={40} alt="icon  social media" />
        <p className="px-10" style={{ direction: 'ltr' }}>{title}</p>
      </Link>
    )
  }
  function Con({ slug, src }) {
    return (
      <Link href={slug} className="box row p-10 aitem  "  >
        <Image src={`/icons/${src}`} width={40} height={40} alt="icon  social media" />
      </Link>
    )
  }
  return (
    <>
      <div className=" page   center m-a  p-10  ">
        <div className="box col bord aitem">
          <h2 className="p-20 ">اتصل بنا</h2>
          {/* wa lb */}
          <div className="box col w-full  p-10">

            <Line slug={"https://api.whatsapp.com/send?phone=905380594084"} src={"whatsapp.svg"} title={"+90 538 059 40 84"} />
            {/* wa tr */}
            <Line slug={"https://api.whatsapp.com/send?phone=96171234567"} src={"whatsapp.svg"} title={" +961 71 234 567"} />
            {/* email */}
            <Line slug={"mailto:info@alamalmoubdien.com"} src={"email.svg"} title={"info@alamalmoubdien.com"} />

          </div>
        </div>
      </div>
      <div className="box col bord m-10  aitem page">
        <h3>تابعينا على </h3>
        <div className="my-10 box row w-300 space">
          <Con slug="https://www.facebook.com/Alam.almoubdien/" src="fb.svg" />
          <Con slug="https://instagram.com/alam.almoubdien" src="insta.svg" />
          <Con slug="https://t.me/alamalmoubdien" src="t.svg" />
          <Con slug="https://twitter.com/almoubdien?s=08" src="twitter.svg" />
          <Con slug="https://youtube.com/channel/UCQVLTT_gQrGLgFxyjmHWa1Q" src="youtube.svg" />
        </div>
      </div>
    </>
  )
}