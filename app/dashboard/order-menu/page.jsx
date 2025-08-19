'use client'

import { FiCheckCircle, FiClock, FiShoppingBag, FiChevronDown } from 'react-icons/fi';
import { useState } from 'react';

export default function OrderMenu() {
  const [openDropdown, setOpenDropdown] = useState(null);

  // Hardcoded orders data
  const pendingOrders = [
    {
      id: 6,
      time: '15 mins ago',
      table: '0003',
      amount: '$24.50',
      items: [
        { name: 'Burger', price: '$8.50' },
        { name: 'Pizza', price: '$12.00' },
        { name: 'Coke', price: '$4.00' },
      ]
    },
    {
      id: 7,
      time: '25 mins ago',
      table: '0005',
      amount: '$18.75',
      items: [
        { name: 'Pasta', price: '$10.00' },
        { name: 'Garlic Bread', price: '$5.00' },
        { name: 'Lemonade', price: '$3.75' },
      ]
    },
    {
      id: 8,
      time: '35 mins ago',
      table: '0002',
      amount: '$32.25',
      items: [
        { name: 'Steak', price: '$22.00' },
        { name: 'Mashed Potatoes', price: '$6.00' },
        { name: 'Red Wine', price: '$4.25' },
      ]
    }
  ];

  const completedOrders = [
    {
      id: 1,
      time: '1 hour ago',
      table: '0001',
      amount: '$24.50',
      items: [
        { name: 'Burger', price: '$8.50' },
        { name: 'Pizza', price: '$12.00' },
        { name: 'Coke', price: '$4.00' },
      ]
    },
    {
      id: 2,
      time: '2 hours ago',
      table: '0004',
      amount: '$18.00',
      items: [
        { name: 'Pasta', price: '$10.00' },
        { name: 'Garlic Bread', price: '$5.00' },
        { name: 'Lemonade', price: '$3.00' },
      ]
    },
    {
      id: 3,
      time: '3 hours ago',
      table: '0006',
      amount: '$28.50',
      items: [
        { name: 'Fish & Chips', price: '$14.00' },
        { name: 'Beer', price: '$6.00' },
        { name: 'Ice Cream', price: '$8.50' },
      ]
    }
  ];

  const toggleDropdown = (orderId) => {
    setOpenDropdown(openDropdown === orderId ? null : orderId);
  };

  const markAsCompleted = (orderId) => {
    console.log(`Marking order ${orderId} as completed`);
    setOpenDropdown(null);
  };

  return (
    <div className="space-y-8">
      {/* Top header section */}
      <div className="flex justify-between items-center border-b border-black pb-2">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <div className="flex gap-4 text-sm">
          <span className="text-[#00bf63] flex items-center gap-1 font-bold">
            <FiCheckCircle /> 100 Completed
          </span>
          <span className="text-[#cb212d] flex items-center gap-1 font-bold">
            <FiClock /> 24 Pending
          </span>
        </div>
      </div>
      
      {/* Main content grid */}
      <div className="grid grid-cols-2 gap-8">
        {/* Pending orders column */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiClock className="text-[#cb212d]" /> Pending Orders
          </h2>
          
          <div className="space-y-6">
            {pendingOrders.map((order) => (
              <div key={order.id} className="bg-[#ede9e9] rounded-lg shadow-md overflow-hidden">
                {/* Order header */}
                <div className="p-4 flex justify-between items-center">
                  <h3 className="font-semibold">Order #{order.id}</h3>
                  <div className="flex items-center gap-2">
                    <span className="font-bold flex items-center gap-1">
                      <FiShoppingBag /> {order.amount}
                    </span>
                    <div className="relative">
                      <button 
                        className="text-xs px-2 py-1 bg-[#cb212d] text-white rounded-full flex items-center gap-1 hover:bg-[#b81d28]"
                        onClick={() => toggleDropdown(order.id)}
                      >
                        Pending
                        <FiChevronDown size={10} />
                      </button>
                      
                      {openDropdown === order.id && (
                        <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                          <button 
                            className="block w-full text-left px-3 py-2 text-sm text-[#00bf63] hover:bg-[#00bf6333]"
                            onClick={() => markAsCompleted(order.id)}
                          >
                            Completed
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Order details */}
                <div className="p-4 pt-0 space-y-3">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <FiClock size={14} />
                      <span>{order.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiShoppingBag size={14} />
                      <span>Table {order.table}</span>
                    </div>
                  </div>
                  
                  {/* Order items */}
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between p-2 rounded-lg bg-white">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-[#cb212d33] flex items-center justify-center text-[#cb212d] text-xs">
                            {index + 1}
                          </div>
                          <span>{item.name}</span>
                        </div>
                        <span className="font-medium">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Completed orders column */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiCheckCircle className="text-[#00bf63]" /> Completed Orders
          </h2>
          
          <div className="space-y-6">
            {completedOrders.map((order) => (
              <div key={order.id} className="bg-[#ede9e9] rounded-lg shadow-md overflow-hidden">
                {/* Order header */}
                <div className="p-4 flex justify-between items-center">
                  <h3 className="font-semibold">Order #{order.id}</h3>
                  <div className="flex items-center gap-2">
                    <span className="font-bold flex items-center gap-1">
                      <FiShoppingBag /> {order.amount}
                    </span>
                    <span className="text-xs px-2 py-1 bg-[#00bf63] text-white rounded-full">
                      Completed
                    </span>
                  </div>
                </div>
                
                {/* Order details */}
                <div className="p-4 pt-0 space-y-3">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <FiClock size={14} />
                      <span>{order.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiShoppingBag size={14} />
                      <span>Table {order.table}</span>
                    </div>
                  </div>
                  
                  {/* Order items */}
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between p-2 rounded-lg bg-white">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-[#cb212d33] flex items-center justify-center text-[#cb212d] text-xs">
                            {index + 1}
                          </div>
                          <span>{item.name}</span>
                        </div>
                        <span className="font-medium">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}