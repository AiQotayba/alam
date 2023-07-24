import { AuthServerSide } from "@/lib/app2";
import axios from "axios";
import Link from "next/link";
export async function getServerSideProps(ctx) {
  // return await AuthServerSide(ctx, 'family', async ({ NEXT_PUBLIC_API, config }) => {
  // let url = `${NEXT_PUBLIC_API}/setting`
  // let { data } = await axios.get(url, config);
  return { props: {} }
  // return { props: { data, config } }
  // })
}
export default function Home(props) {
  return (
    <>
      {/* <Link href={'/admin'} className="center box btn w-300   m-a">لوحة التحكم</Link> */}
      {/* Hero */}
      <Hero {...props} />
      {/* Login or admin */}

      {/* Courses */}

      {/* Contact us and social media links  */}

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