export default function Button({buttonText,onClick}:{buttonText:string,onClick?:()=>void}){
    return(
        <button onClick={onClick}  className="bg-black text-white px-4 py-1 rounded-md w-full hover:bg-slate-500 text-sm font-md">
            {buttonText} 
        </button>
    )
}