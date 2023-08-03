import Image from "next/image";

export default function Offline() {
    return (
        <div className="box col m-a j aitem">
            <Image src={"/icons/offline.svg"} width={100} height={100} alt="icon offline" />
            <h1>لا يتوفر اتصال بالانترنت</h1>
        </div>
    )
}