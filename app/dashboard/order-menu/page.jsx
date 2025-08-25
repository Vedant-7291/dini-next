// app/dashboard/order-menu/page.jsx
'use client'

import { FiCheckCircle, FiClock, FiShoppingBag, FiChevronDown, FiRefreshCw } from 'react-icons/fi';
import { useState, useEffect } from 'react';

export default function OrderMenu() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, accepted: 0, completed: 0 });

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Fetch accepted orders
      const acceptedResponse = await fetch('https://dini-next-kvwx.vercel.app/api/orders?status=accepted');
      const acceptedData = acceptedResponse.ok ? await acceptedResponse.json() : [];
      
      // Fetch completed orders
      const completedResponse = await fetch('https://dini-next-kvwx.vercel.app/api/orders?status=completed');
      const completedData = completedResponse.ok ? await completedResponse.json() : [];
      
      // Fetch stats
      const statsResponse = await fetch('https://dini-next-kvwx.vercel.app/api/orders/stats');
      const statsData = statsResponse.ok ? await statsResponse.json() : { total: 0, accepted: 0, completed: 0 };
      
      setAcceptedOrders(acceptedData);
      setCompletedOrders(completedData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Removed automatic polling interval
  }, []);

  const toggleDropdown = (orderId) => {
    setOpenDropdown(openDropdown === orderId ? null : orderId);
  };

  const markAsCompleted = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'completed' }),
      });

      if (response.ok) {
        // Refresh orders
        fetchOrders();
        setOpenDropdown(null);
      } else {
        console.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  // Format time ago
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cb212d] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Top header section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-black pb-2 gap-2">
        <h1 className="text-xl lg:text-2xl font-bold">Order Management</h1>
        <div className="flex justify-center gap-3 lg:gap-4 text-sm w-full lg:w-auto">
          <span className="text-[#00bf63] flex items-center gap-1 font-bold text-base lg:text-lg">
            <FiCheckCircle /> {stats.completed} Completed
          </span>
          <span className="text-[#cb212d] flex items-center gap-1 font-bold text-base lg:text-xl">
            <FiClock /> {stats.accepted} Pending
          </span>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-1 px-2 py-1 bg-[#ede9e9] rounded-md hover:bg-gray-200 transition-colors"
          >
            <FiRefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>
      
      {/* Mobile toggle button */}
      <div className="lg:hidden flex justify-center">
        <div className="bg-[#ede9e9] rounded-full p-1 flex">
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium ${!showCompleted ? 'bg-[#cb212d] text-white' : 'text-gray-600'}`}
            onClick={() => setShowCompleted(false)}
          >
             Pending Orders
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium ${showCompleted ? 'bg-[#00bf63] text-white' : 'text-gray-600'}`}
            onClick={() => setShowCompleted(true)}
          >
            Completed Orders
          </button>
        </div>
      </div>
      
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Accepted orders column - hidden on mobile when showing completed */}
        <div className={showCompleted ? 'hidden lg:block' : ''}>
          <h2 className="text-lg lg:text-xl font-semibold mb-4 flex items-center gap-2">
            <FiClock className="text-[#cb212d] text-xl" /> Pending Orders
          </h2>
          
          <div className="space-y-4 lg:space-y-6">
            {acceptedOrders.map((order) => (
              <div key={order._id} className="bg-[#ede9e9] rounded-lg shadow-md overflow-hidden">
                {/* Order header - Two columns layout */}
                <div className="p-4 flex justify-between items-start gap-4">
                  {/* Left Column - Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FiShoppingBag className="text-[#cb212d]" size={18} />
                      <span className="font-semibold">Order #{order._id.slice(-4)}</span>
                    </div>
                    
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiClock size={14} />
                        <span>{formatTimeAgo(order.createdAt)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <FiShoppingBag size={14} />
                        <span>Table {order.tableNumber}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column - Price and Status */}
                  <div className="flex flex-row items-end gap-2">
                    <span className="font-bold text-lg lg:text-xl">
                      ₹ {order.totalAmount.toFixed(2)}
                    </span>
                    <div className="relative">
                      <button 
                        className="cursor-pointer text-xs sm:text-sm px-2 py-1 bg-[#cb212d] text-white rounded-full flex items-center gap-1 hover:bg-[#b81d28]"
                        onClick={() => toggleDropdown(order._id)}
                      >
                        Pending
                        <FiChevronDown size={10} />
                      </button>
                      
                      {openDropdown === order._id && (
                        <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                          <button 
                            className="cursor-pointer block w-full text-left px-3 py-2 text-sm text-[#00bf63] hover:bg-[#00bf6333]"
                            onClick={() => markAsCompleted(order._id)}
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
                  {/* Order items */}
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between p-2 rounded-lg bg-white">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-[#cb212d33] flex items-center justify-center text-[#cb212d] text-xs">
                            {index + 1}
                          </div>
                          <span className="text-sm lg:text-base">{item.name}</span>
                          <span className="text-xs text-gray-500">x{item.quantity}</span>
                        </div>
                        <span className="font-medium text-sm lg:text-base">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Completed orders column - hidden on mobile when showing accepted */}
        <div className={!showCompleted ? 'hidden lg:block' : ''}>
          <h2 className="text-lg lg:text-xl font-semibold mb-4 flex items-center gap-2">
            <FiCheckCircle className="text-[#00bf63] text-xl" /> Completed Orders
          </h2>
          
          <div className="space-y-4 lg:space-y-6">
            {completedOrders.map((order) => (
              <div key={order._id} className="bg-[#ede9e9] rounded-lg shadow-md overflow-hidden">
                {/* Order header - Two columns layout */}
                <div className="p-4 flex justify-between items-start gap-4">
                  {/* Left Column - Order Info */}
                  <div className="lg:flex-1 flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <FiShoppingBag className="text-[#00bf63]" size={18} />
                      <span className="font-semibold">Order #{order._id.slice(-4)}</span>
                    </div>
                    
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiClock size={14} />
                        <span>{formatTimeAgo(order.createdAt)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <FiShoppingBag size={14} />
                        <span>Table {order.tableNumber}</span>
                      </div>
                     
                    </div>
                  </div>
                  
                  {/* Right Column - Price and Status */}
                  <div className="flex lg:flex-row flex-col items-end gap-2">
                    <span className="font-bold text-lg lg:text-xl">
                      ₹ {order.totalAmount.toFixed(2)}
                    </span>
                    <span className="text-xs sm:text-sm px-2 py-1 bg-[#00bf63] text-white rounded-full">
                      Completed
                    </span>
                  </div>
                </div>
                
                {/* Order details */}
                <div className="p-4 pt-0 space-y-3">
                  {/* Order items */}
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between p-2 rounded-lg bg-white">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-[#cb212d33] flex items-center justify-center text-[#cb212d] text-xs">
                            {index + 1}
                          </div>
                          <span className="text-sm lg:text-base">{item.name}</span>
                          <span className="text-xs text-gray-500">x{item.quantity}</span>
                        </div>
                        <span className="font-medium text-sm lg:text-base">₹{(item.price * item.quantity).toFixed(2)}</span>
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