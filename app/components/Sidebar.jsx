'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiHome, FiPlusCircle, FiList, FiSettings } from 'react-icons/fi'

export default function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { href: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { href: '/new-order', icon: <FiPlusCircle />, label: 'New Order' },
    { href: '/order-menu', icon: <FiList />, label: 'Order' },
    { href: '/manage-menu', icon: <FiSettings />, label: 'Manage Menu' },
  ]

  return (
    <div className="h-[86vh] flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden mt-10">
      <div className="p-6 bg-white">
        <h1 className="text-2xl font-bold text-[#cb212d] border-b border-[#cb212d]">SMARTDINI</h1>
      </div>
      
      <div className="flex-1 p-6 space-y-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              pathname === item.href 
                ? 'bg-[#cb212d33] text-[#cb212d] font-medium' 
                : 'hover:bg-[#cb212d11] text-gray-700'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}