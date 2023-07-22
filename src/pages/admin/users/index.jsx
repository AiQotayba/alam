import { Table, message } from "antd";
import axios from "axios";
import Link from "next/link";

import { AuthServerSide } from "@/lib/app2";
import { useState } from "react";
import Image from "next/image";

export async function getServerSideProps(ctx) {
	return await AuthServerSide(ctx, 'admin', async ({ NEXT_PUBLIC_API, config }) => {
		let url = `${NEXT_PUBLIC_API}/users`
		let { data } = await axios.get(url, config);
		return { data, config }
	})
}

export default function AdminUsers(props) {
	let [data, setD] = useState(() => props?.data.map(a => ({ ...a, view: false })));
	let [One, setOne] = useState(null)

	function openMenu(data) {
		setOne(One === null ? data : null)
	}
	const columns = [
		{ title: "الاسم", dataIndex: "fullname", key: "fullname" },
		{ title: "الايميل", dataIndex: "email", key: "email" },
		{ title: "الهاتف", dataIndex: "phone", key: "phone" },
		{ title: "النقاط", dataIndex: "coins", key: "coins" },
		{
			title: "نوع الحساب", dataIndex: "typeUser", key: "typeUser",
			render: (_, record) => (
				<>
					{record.typeUser?.filter(a => a == "teacher").length > 0 ? <p> معلمة</p> : <></>}
					{record.typeUser?.filter(a => a == "admin").length > 0 ? <p> مسؤول</p> : <></>}
				</>
			)

		},
		{
			title: "الخيارات", dataIndex: "view", key: "view",
			render: (_, record) =>
				<Image src="/icons/menu2.svg" alt="icon" width={25} height={25} onClick={() => openMenu(record)} />
		}
	];

	return (
		<section className="bord p-10 m-10">
			<h1 className="m-20">المستخدمين</h1>
			<Menu data={One} set={setOne} />

			<div className="m-10">
				{props.data.length > 0 ? <Table dataSource={data} columns={columns} pagination={false} /> : ""}
			</div>
		</section>
	)
}

function Menu({ data, set }) {
	function Delete() {
		axios.delete(
			`/api/users/${data?._id}`,
		).then(({ data }) => {
			message.success(data.msg)
			location.reload()
		})

	}
	if (data?.fullname) {
		return (
			<div className="bord box col m-a pup w-300" style={{ left: '50px', right: '50px', zIndex: '1' }}>
				<Link href={`/admin/users/${data._id}/childs`} className="p-10">الاطفال</Link>
				<Link href={`/admin/users/${data._id}/edit-profile`} className="p-10">تعديل المستخدم</Link>
				<Link href={`/admin/users/${data._id}/new-password`} className="p-10">تغيير كلمة السر</Link>
				<Link href={`/admin/users/${data._id}/upgrade`} className="p-10">تغيير الصلاحيات  </Link>
				<p className="p-10" style={{ color: "#0292ab" }} onClick={Delete}>حذف</p>
				<button className="p-10 mt-20" onClick={() => set(null)} >الغاء </button>
			</div>
		)
	} else return <></>
}