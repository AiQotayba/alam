import { AuthServerSide } from "@/lib/app2.js"; 
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { Popconfirm, Table, message } from "antd";
import { useRouter } from "next/router";
import { MenuLine } from "@/lib/ui";

export async function getServerSideProps(ctx) {
    return await AuthServerSide(ctx, "admin", async ({ NEXT_PUBLIC_API, config }) => {
        let url = `${NEXT_PUBLIC_API}/admin/course-ads`;
        let { data } = await axios.get(url, config);
        return { data, config };
    });
}
export default function AdminUsers(props) {
    let [data, setD] = useState(props?.data);
    async function Delete(id) {
        let url = `/api/admin/course-ads/${id}`;
        let res = await axios.delete(url, props?.config);
        message.success(res.data.msg);
        let New = data?.filter((a) => a._id != id);
        setD(New);
    }
    function DeleteBtn({ fun }) {
        return (
            <Popconfirm
                title={"هل أنت متأكدة من حذف الدورة"}
                onConfirm={fun}
                okText={"نعم"}
                cancelText={"لا"}
            >
                <button className="err p-10 m-10 " style={{ color: "#0292ab" }}> حذف </button>
            </Popconfirm>
        )
    }
    const columns = [
        {
            title: "العنوان", dataIndex: "title", key: "title", width: 260,    fixed: 'left',
            render: (_, record) => <Link href={`/admin/course-ads/${record._id}`} >{record.title} </Link>
        },
        { title: "السعر", dataIndex: "price", key: "price" },
        { title: "الوقت", dataIndex: "duration", key: "duration" },
        {
            title: "حذف", dataIndex: "delete", key: "delete", width: 100,
            render: (_, record) => <DeleteBtn fun={() => Delete(record._id)} />
        }
    ];
    return (
        <section className="bord p-10 m-10">
        
			<MenuLine />
            <div className="m-10 box grid aitem">
                <h1 className="mx-20">الدورات التدريبية</h1>
                <Link href={`/admin/course-ads/add`} className="py-10 btn aitem"> اضافة دورة التدريبية  </Link>
            </div>
            <Table dataSource={data} columns={columns} pagination={false} rowKey={(record) => record._id} className="m-10" scroll={{ x: 700 }} />
        </section>
    )
}
