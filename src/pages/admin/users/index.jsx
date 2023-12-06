import { Popconfirm, Table, message } from "antd";
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
		{ title: "الاسم", dataIndex: "fullname", key: "fullname", width: 250 },
		{ title: "الايميل", dataIndex: "email", key: "email", width: 250 },
		{ title: "الهاتف", dataIndex: "phone", key: "phone", width: 150 },
		{ title: "النقاط", dataIndex: "coins", key: "coins", width: 100 },
		{
			title: "نوع الحساب", dataIndex: "typeUser", key: "typeUser", width: 100,
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
			<Menu data={One} set={setOne} config={props.config} />

			<div className="m-10">
				<Table dataSource={data} columns={columns} pagination={false} scroll={{ x: 700 }} />
			</div>
		</section>
	)
}

function Menu({ data, set, config }) {
	let [rival, setR] = useState(false)
	let [coin, setC] = useState(0)

	function Delete() {
		axios.delete(`/api/users/${data?._id}`, config)
			.then(({ data }) => {
				message.success(data.msg)
				location.reload()
			})
	}
	function reset() {
		axios.all(`/api/users/${data?._id}`, {}, config)
			.then(({ data }) => {
				message.success(" تم تصفير النقاط")
				location.reload()
			})
	}
async	function Rival(e) {
		if (e.target.name == "x") setR(false)
		else {
		 console.log(config)
			setR(false)
			// axios
			// send to api
			 await axios.put(`/api/users/${data?._id}/rival` ,{coin} , config)
				.then(res => message.success(res.data.msg))
		}

	}
	if (data?.fullname) {
		return (
			<div className="bord box col m-a pup w-300" style={{ left: '50px', right: '50px', zIndex: '1', top: 70 }}>
				<Link href={`/admin/users/${data._id}/childs`} className=" px-10 mx-10">الاطفال</Link>
				<Link href={`/admin/users/${data._id}/edit-profile`} className="px-10  mx-10">تعديل المستخدم</Link>
				<Link href={`/admin/users/${data._id}/new-password`} className="px-10 mx-10">تغيير كلمة السر</Link>
				<Link href={`/admin/users/${data._id}/upgrade`} className="px-10 mx-10">تغيير الصلاحيات  </Link>

				{!rival ? <button className="p-10 m-10 off" style={{ color: "#0292ab" }} onClick={() => setR(true)} >خصم من النقاط</button> :
					<div className="box row m-10">
						<input type="number" name="coin" style={{ width: '80px' }} onChange={e => setC(e.target.value)} />
						<button className="mr-10 off" name="x" onClick={Rival}>الغاء </button>
						<button className="mr-10" onClick={Rival}>خصم </button>
					</div>
				}
				<Popconfirm title="هل أنت متأكدة من تصفير النقاط  " onConfirm={reset} okText="نعم" cancelText="لا" >
					<button className="p-10 m-10 off" style={{ color: "#0292ab" }}  >تصفير النقاط</button>
				</Popconfirm>
				<Popconfirm title="هل أنت متأكدة من حذف المستخدمين" onConfirm={Delete} okText="نعم" cancelText="لا" >
					<button className="p-10 m-10 off" style={{ color: "#0292ab" }} >حذف</button>
				</Popconfirm>
				<button className="p-10 mt-20" onClick={() => set(null)} >الغاء </button>
			</div>
		)
	} else return <></>
}
