import Image from "next/image"

export default function CardAtt({ data: att }) {

    return (
        <div className="  bord box col m-10 p-20 w-300" >
            <div className="box col space  ">
                <b className="p-10">{att?.child_id?.name}</b>
                <div className="box row aitem my-10" >
                    <Image src={"/icons/session.svg"} width={20} height={20} alt="icon " />
                    <p className={`mx-10 `}>{att?.session_id?.title}</p>
                </div>
                <div className="box row aitem space" >
                    <div className="box row aitem  " >
                        <Image src={"/icons/date-time.svg"} width={20} height={20} alt="icon " />
                        <p className={`mx-10 color`}>{new Date(att?.create_at).toLocaleDateString()}</p>
                    </div>
                    <p className={`mx-10 color-err `}>{att.absence == true ? "غائب" : <></>}</p>
                </div>
            </div>
            <p className="my-10 p-10 px-20" style={{
                borderRadius: '20px',
                backgroundColor: '#eee',
                wordWrap: 'break-word'
            }}
            >
                {att?.feedback}
            </p>
        </div>
    )
}