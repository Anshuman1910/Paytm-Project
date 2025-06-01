import Signout from "./Signout"

export default function AppBar({ name }: { name: string }) {
  return (
    <div className="flex justify-between h-14 shadow-md">
      <div className="flex flex-col justify-center items-center h-full px-4 py-2 font-bold text-black">
        PayTM
      </div>
      <div className="flex">
        <div className="flex flex-col justify-center h-full mr-4">
          Hello, {name}
        </div>
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
          <div className="flex flex-col justify-center h-full text-xl">
            {name[0]}
          </div>
        </div>
        <div className="flex flex-col justify-center h-full text-md ml-4 mr-2">
          <Signout />
        </div>
      </div>
    </div>
  );
}
