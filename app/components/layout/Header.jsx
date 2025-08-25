import { FiBell, FiUser } from 'react-icons/fi'

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4  bg-[#cb212d] lg:rounded-lg">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-white flex items-center justify-center text-black">
          <span className="font-bold text-sm lg:text-base">SD</span>
        </div>
        <h1 className="text-lg lg:text-xl font-semibold text-white">Admin Dashboard !</h1>
      </div>
    </header>
  )
}