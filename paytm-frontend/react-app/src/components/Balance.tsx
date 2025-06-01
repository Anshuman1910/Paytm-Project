export default function Balance({balance}:{balance:number}){
    return(
        <div className="flex">
        <div className=" text-lg font-bold text-black">
            Your Balance
        </div>
        <div className="text-lg font-semibold text-black ml-4">
            Rs {balance}
        </div>
        </div>
    )
}