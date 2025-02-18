import { AuthServerSide } from "@/lib/app2";
import { MenuLine } from "@/lib/ui";
import { Table } from "antd";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";

export async function getServerSideProps(ctx) {
	return await AuthServerSide(ctx, 'admin', async ({ NEXT_PUBLIC_API, config }) => {
		let url = `${NEXT_PUBLIC_API}/courses`
		let { data } = await axios.get(url, config);
		return { data, config }
	})
}

export default function AdminUsers(props) {
	let [data, setD] = useState(() => props?.data.map(a => ({ ...a, view: false })));

	const columns = [
		{
			title: "الاسم", dataIndex: "title", key: "title", fixed: "left", width: 200,
			render: (_, record) => <Link href={`/admin/courses/${record._id}`} > {record.title}</Link>
		},
		{
			title: "المدربة /ات", dataIndex: "teacher", key: "teacher", width: 200,
			render: (_, record) => <div>{record.teacher.map(a => <p key={a._id} >{a.fullname}</p>)}</div>
		},
		{
			title: "عدد الطلاب", dataIndex: "student", key: "student",width: 100,
			render: (_, record) => <div>{record.students.length}</div>
		},
		{
			title: "الاتمام", dataIndex: "completion", key: "completion",
			render: (_, record) => <p>{record.completion ? "تم " : "لم يتم "} الانتهاء</p>
		},
	];
	return (
		<section className="bord p-10 m-10">
			<MenuLine />
			<div className="m-10 box grid aitem">
				<h1 className="mx-20">الدورات التدريبية</h1>
				<Link href={`/admin/courses/add`} className="py-10 btn aitem" >اضافة دورة التدريبية</Link>
			</div>

			<div className="m-10">
				<Table dataSource={data} columns={columns} pagination={false} scroll={{ x: 700 }} />
			</div>
		</section>
	)
}
