// New Order page.jsx - Made responsive
'use client'
import { FiClock, FiCheck, FiX,  FiShoppingBag } from 'react-icons/fi'

export default function NewOrder() {
  // Hardcoded order data
  const orders = [
    {
      id: 1,
      time: 'just now',
      table: '0001',
      amount: '24.50',
      items: [
        { name: 'Burger', price: '8.50' },
        { name: 'Pizza', price: '12.00' },
        { name: 'Coke', price: '4.00' }
      ]
    },
    {
      id: 2,
      time: '2 mins ago',
      table: '0002',
      amount: '18.75',
      items: [
        { name: 'Pasta', price: '10.00' },
        { name: 'Garlic Bread', price: '5.00' },
        { name: 'Lemonade', price: '3.75' }
      ]
    },
    {
      id: 3,
      time: '5 mins ago',
      table: '0003',
      amount: '32.25',
      items: [
        { name: 'Steak', price: '22.00' },
        { name: 'Mashed Potatoes', price: '6.00' },
        { name: 'Red Wine', price: '4.25' }
      ]
    }
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-xl lg:text-2xl font-bold flex items-center gap-2 border-b border-black pb-2">
        New Orders
      </h1>

      {orders.map((order) => (
        <div key={order.id} className="bg-[#ede9e9] rounded-lg shadow-md overflow-hidden">
          {/* Order Header */}
          <div className="p-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:gap-4">
              <div className="flex items-center gap-2">
                <FiShoppingBag className="text-[#cb212d]" size={20} />
                <span className="font-semibold">New Order #{order.id}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiClock size={14} />
                <span>{order.time}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <FiShoppingBag size={14} />
                <span>Table {order.table}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:gap-4 w-full lg:w-auto">
              <span className="font-bold flex items-center gap-1 text-lg lg:text-xl">
                ₹ {order.amount}
              </span>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-[#00bf63] text-white rounded flex items-center gap-1 text-sm lg:text-base">
                  <FiCheck /> Accept
                </button>
                <button className="px-3 py-1 bg-[#cb212d] text-white rounded flex items-center gap-1 text-sm lg:text-base">
                  <FiX /> Reject
                </button>
              </div>
            </div>
          </div>
          
          {/* Order Items */}
          <div className="p-4 pt-0 space-y-3">
            {order.items.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 rounded-xl"
                style={{ backgroundColor: 'white' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#cb212d33] flex items-center justify-center text-[#cb212d] text-xs font-bold">
                    {index + 1}
                  </div>
                  <span className="text-sm lg:text-base">{item.name}</span>
                </div>
                <span className="font-medium text-sm lg:text-base">{item.price}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}