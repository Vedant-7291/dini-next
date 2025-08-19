import { FiBell, FiUser } from 'react-icons/fi'

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-[#cb212d] ">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black">
          <span className="font-bold">SD</span>
        </div>
        <h1 className="text-xl font-semibold text-white">Admin Dashboard !</h1>
      </div>
      
    </header>
  )
}