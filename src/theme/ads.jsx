import { message } from "antd"
import axios from "axios"
import { useRouter } from "next/router"
import { useContext, useState } from "react"
import { useForm } from "react-hook-form"
import { CourseAdsContext } from "@/pages/admin/course-ads/[_id]"

export function EditPart({ One }) {
    let { query } = useRouter();
    const { data, setData, set_OnePart, config } = useContext(CourseAdsContext);
    let [a, setA] = useState(One)
    const { register, handleSubmit, reset } = useForm({ defaultValues: a });

    const Send = (res) => {
        const file = res.image //.files[0];

        let image =One?. image;
        function send(image) {
            let part = { ...res, image };

            let filteredPart = data.part.filter(item => item._id != One._id);

            setData({ ...data, part: [...filteredPart, part] });
            let url = `/api/admin/course-ads/${query._id}`
            axios.patch(url, part, config).then(({ data: d }) => {
                message.success(d.msg);
                reset();
                set_OnePart(null)
            });
        }
        console.log(file)
	if (file?.length > 0 && typeof file == "object") {
          const reader = new FileReader();
          reader.onloadend = () => send(reader.result);
          reader.readAsDataURL(file[0]);
        } else send(image);
    };


    if (!One) return <></>
    else return (
        <form
            className="bord box col p-20 center "
            onSubmit={handleSubmit(Send)}
            style={{ position: "absolute", zIndex: "1" }
            }>
            <h1 className="center box my-20">تعديل اعلان دورة   </h1>

            <label >عنوان الاعلان</label>
            <input type="text"    {...register("title")} />

            <label >وصف الدورة</label>
            <textarea {...register("about")} className="h-200"></textarea>

            <label>الترتيب</label>
            <input type="number" {...register("Sort")} />

            <label>العرض</label>
            <select {...register("typeView")}>
                <option value="row">عرض افقي (الصورة اولا)</option>
                <option value="row-reverse" >عرض افقي (المحتوى اولا)</option>
                <option value="col">عرض عمودي</option>
            </select>

            <h3 >الصورة التعريفية</h3>
            <input type="file" {...register("image")} />

            <div className="mt-20 w-full box row">
                <div className="p-10 m-0 w-full btn off" onClick={() => {
                    set_OnePart(null)
                }} > الغاء </div>
                <input type="submit" className="mr-10 w-full" />
            </div>

        </form>
    )
}

function EditPart2({ OnePart: One }) {
    let { query } = useRouter();
    const { data, setData, set_OnePart, config } = useContext(CourseAdsContext);

    const { register, handleSubmit, reset } = useForm({ defaultValues: One });
    const Send = (res) => {
        const file = res.image //.files[0];

        let image = null;
        function send(image) {
            let part = { ...res, image };

            let filteredPart = data.part.filter(item => item._id != One._id);

            setData({ ...data, part: [...filteredPart, part] });
            let url = `/api/admin/course-ads/${query._id}`
            axios.patch(url, part, config).then(({ data: d }) => {
                message.success(d.msg);
                reset();
                set_OnePart(null)
            });

        }
        if (file.length > 0) {
            const reader = new FileReader();
            reader.onloadend = () => send(reader.result);
            reader.readAsDataURL(file[0]);
        } else send(image);
    };
    if (!One) return <></>
    else return (
        <form
            className="bord box col p-20 center "
            onSubmit={handleSubmit(Send)}
            style={{ position: "absolute", zIndex: "1" }
            }>
            <h1 className="center box my-20">تعديل اعلان دورة   </h1>

            <label >عنوان الاعلان</label>
            <input type="text"    {...register("title")} />

            <label >وصف الدورة</label>
            <textarea {...register("about")} className="h-200"></textarea>

            <label>الترتيب</label>
            <input type="number" {...register("Sort")} />

            <label>العرض</label>
            <select {...register("typeView")}>
                <option value="row">عرض افقي (الصورة اولا)</option>
                <option value="row-reverse" >عرض افقي (المحتوى اولا)</option>
                <option value="col">عرض عمودي</option>
            </select>

            <h3 >الصورة التعريفية</h3>
            <input type="file" {...register("image")} />

            <div className="mt-20 w-full box row">
                <div className="p-10 m-0 w-full btn off" onClick={() => {
                    set_OnePart(null)
                }} > الغاء </div>
                <input type="submit" className="mr-10 w-full" />
            </div>

        </form>
    )
}

