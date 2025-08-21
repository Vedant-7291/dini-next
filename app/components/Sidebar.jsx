'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiHome, FiPlusCircle, FiList, FiSettings, FiX } from 'react-icons/fi'
import { useState, useEffect } from 'react'

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { href: '/dashboard/new-order', icon: <FiPlusCircle />, label: 'New Order' },
    { href: '/dashboard/order-menu', icon: <FiList />, label: 'Order' },
    { href: '/dashboard/manage-menu', icon: <FiSettings />, label: 'Manage Menu' },
  ]

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  // Close sidebar when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Listen for button click in layout.jsx
  useEffect(() => {
    const handleToggleClick = () => {
      setIsOpen(prev => !prev)
    }

    const toggleButton = document.getElementById('mobile-sidebar-toggle')
    if (toggleButton) {
      toggleButton.addEventListener('click', handleToggleClick)
    }

    return () => {
      if (toggleButton) {
        toggleButton.removeEventListener('click', handleToggleClick)
      }
    }
  }, [])

  return (
    <>
      {/* Mobile overlay - semi-transparent black background */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar - white background */}
      <div
        className={`
          h-[90vh] mt-5 flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden
          fixed lg:relative z-50 lg:z-auto transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-64 top-0 left-0
        `}
      >
        <div className="p-6 bg-white flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#cb212d] border-b border-[#cb212d]">
            SMARTDINI
          </h1>
          <button className="lg:hidden text-gray-500" onClick={toggleSidebar}>
            <FiX size={24} />
          </button>
        </div>

        <div className="flex-1 p-6 space-y-4 bg-white">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
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
    </>
  )
}