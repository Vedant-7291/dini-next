// New Order page.jsx - With notification system
'use client'
import { FiClock, FiCheck, FiX, FiShoppingBag, FiXCircle } from 'react-icons/fi'
import { useState } from 'react'

export default function NewOrder() {
  const [orders, setOrders] = useState([
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
  ])

  const [notifications, setNotifications] = useState([])

  // Function to show notification
  const showNotification = (message, type) => {
    const id = Date.now()
    const newNotification = { id, message, type }
    setNotifications(prev => [...prev, newNotification])
    
    // Auto remove notification after 3 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(notif => notif.id !== id))
    }, 3000)
  }

  // Handle accept order
  const handleAcceptOrder = (orderId) => {
    setOrders(prev => prev.filter(order => order.id !== orderId))
    showNotification(`Order #${orderId} accepted successfully!`, 'success')
  }

  // Handle reject order
  const handleRejectOrder = (orderId) => {
    setOrders(prev => prev.filter(order => order.id !== orderId))
    showNotification(`Order #${orderId} rejected.`, 'error')
  }

  return (
    <div className="space-y-6 relative">
      {/* Notification Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-lg border-l-4 ${
              notification.type === 'success'
                ? 'bg-green-100 border-green-500 text-green-800'
                : 'bg-red-100 border-red-500 text-red-800'
            } flex items-center justify-between min-w-80 animate-slide-in`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <FiCheck className="text-green-600" size={20} />
              ) : (
                <FiXCircle className="text-red-600" size={20} />
              )}
              <span className="font-medium">{notification.message}</span>
            </div>
            <button
              onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <FiX size={16} />
            </button>
          </div>
        ))}
      </div>

      <h1 className="text-xl lg:text-2xl font-bold flex items-center gap-2 border-b border-black pb-2">
        New Orders
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-[#ede9e9] rounded-lg">
          <FiShoppingBag className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">No new orders at the moment</p>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="bg-[#ede9e9] rounded-lg shadow-md overflow-hidden">
            {/* Order Header - Two columns layout */}
            <div className="p-4 flex justify-between items-start gap-4">
              {/* Left Column - Order Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <FiShoppingBag className="text-[#cb212d]" size={20} />
                  <span className="font-semibold">Order #{order.id}</span>
                </div>
                
                <div className="flex flex-col gap-1 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiClock size={14} />
                    <span>{order.time}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <FiShoppingBag size={14} />
                    <span>Table {order.table}</span>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Price and Actions */}
              <div className="flex flex-row items-end gap-2">
                <span className="font-bold text-lg lg:text-xl">
                  ₹ {order.amount}
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleAcceptOrder(order.id)}
                    className="px-3 py-1 bg-[#00bf63] text-white rounded flex items-center gap-1 text-sm cursor-pointer hover:bg-[#00a758] transition-colors"
                  >
                    <FiCheck /> Accept
                  </button>
                  <button 
                    onClick={() => handleRejectOrder(order.id)}
                    className="px-3 py-1 bg-[#cb212d] text-white rounded flex items-center gap-1 text-sm cursor-pointer hover:bg-[#b81d28] transition-colors"
                  >
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
        ))
      )}
    </div>
  )
}