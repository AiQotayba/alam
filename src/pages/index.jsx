import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Link href={'/admin'} className="center box btn w-300   m-a">لوحة التحكم</Link>
    </main>
  )
}
