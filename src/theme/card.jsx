import Image from "next/image"

export default function CardAtt({ data: att }) {
    let ratingContext = ["غياب", "ضعيف جدا", "ضعيف", "معتدل", "جيد جدا", "ممتاز"]

    return (
        <div className="  bord box col m-10 p-20 w-300" >
            <div className="box col space  ">
                <b className="p-10">{att?.child_id?.name}</b>
                <div className="box row aitem my-10" >
                    <Image src={"/icons/session.svg"} width={20} height={20} alt="icon " />
                    <p className={`mx-10 `}>{att?.session_id?.title}</p>
                </div>
                {/* rating */}
                <div className="box row aitem space" >
                    <div className="box row aitem  " >
                        <Image src={"/icons/date-time.svg"} width={20} height={20} alt="icon " />
                        <p className={`mx-10 color`}>{new Date(att?.create_at).toLocaleDateString()}</p>
                    </div>
                    <div className="box row aitem  " >
                        <Image src={"/icons/star.svg"} width={20} height={20} alt="icon " />
                        <p className={`mx-10 color${att.rating > 2 ? " " : "-err"}`}>{ratingContext[att.rating]}</p>
                    </div>
                </div>
            </div>
            <p className="my-10 p-10 px-20" style={{
                borderRadius: '20px',
                backgroundColor: '#eee'
            }}
            >
                {att?.feedback}
            </p>
        </div>
    )
}