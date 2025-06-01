export default function InputBox({label,placeholder,onChange,value}:{label:string,placeholder:string,onChange?:(event: React.ChangeEvent<HTMLInputElement>)=>void,value?:string}){
    return(
        <div>
        <div className="text-sm font-md text-left  py-2 text-black">
           {label}
        </div>
        <input value={value} onChange={onChange} placeholder={placeholder} className="border-2 border-black rounded-md px-4 py-2 text-black w-full"/>
        </div>
    )
}