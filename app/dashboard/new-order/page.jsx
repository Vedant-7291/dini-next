// app/dashboard/new-orders/page.jsx
'use client'
import { FiClock, FiCheck, FiX, FiShoppingBag, FiXCircle, FiRefreshCw } from 'react-icons/fi'
import { useState, useEffect } from 'react'

export default function NewOrder() {
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://dini-next-kvwx.vercel.app/api/orders?status=pending');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error('Failed to fetch orders');
      }
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

  // Function to show notification
  const showNotification = (message, type) => {
    const id = Date.now();
    const newNotification = { id, message, type };
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto remove notification after 3 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, 3000);
  };

  // Handle accept order
  const handleAcceptOrder = async (orderId) => {
    try {
      const response = await fetch(`https://dini-next-kvwx.vercel.app/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'accepted' }), // Changed from 'completed' to 'accepted'
      });

      if (response.ok) {
        setOrders(prev => prev.filter(order => order._id !== orderId));
        showNotification(`Order #${orderId.slice(-4)} accepted successfully!`, 'success');
      } else {
        console.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  // Handle reject order
  const handleRejectOrder = async (orderId) => {
    try {
      const response = await fetch(`https://dini-next-kvwx.vercel.app/api/orders/${orderId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setOrders(prev => prev.filter(order => order._id !== orderId));
        showNotification(`Order #${orderId.slice(-4)} rejected.`, 'error');
      } else {
        console.error('Failed to delete order');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
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

      <div className="flex justify-between items-center border-b border-black pb-2">
        <h1 className="text-xl lg:text-2xl font-bold flex items-center gap-2">
          New Orders
        </h1>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-3 py-1 bg-[#ede9e9] rounded-md hover:bg-gray-200 transition-colors"
        >
          <FiRefreshCw size={16} /> Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-[#ede9e9] rounded-lg">
          <FiShoppingBag className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">No new orders at the moment</p>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="bg-[#ede9e9] rounded-lg shadow-md overflow-hidden">
            {/* Order Header - Two columns layout */}
            <div className="p-4 flex justify-between items-start gap-4">
              {/* Left Column - Order Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <FiShoppingBag className="text-[#cb212d]" size={20} />
                  <span className="font-semibold">Order #{order._id.slice(-4) }</span>
                  <span className={`text-xs bg-blue-100 ${order.paymentMethod === 'cash' ? 'text-[#cb212d]' : 'text-green-600'} px-2 py-1 rounded`}>
                      {order.paymentMethod}
                    </span>
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
              <div className="flex items-start gap-2">
                    
                  </div>
              
              {/* Right Column - Price and Actions */}
              <div className="flex flex-col lg:flex-row items-end gap-2">
                <span className="font-bold text-lg lg:text-xl">
                  ₹ {order.totalAmount.toFixed(2)}
                </span>
                <div className="flex flex-col lg:flex-row gap-2">
                  <button 
                    onClick={() => handleAcceptOrder(order._id)}
                    className="px-3 py-1 bg-[#00bf63] text-white rounded flex items-center gap-1 text-sm cursor-pointer hover:bg-[#00a758] transition-colors"
                  >
                    <FiCheck /> Accept
                  </button>
                  <button 
                    onClick={() => handleRejectOrder(order._id)}
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
                  className="flex items-center justify-between p-3 rounded-xl bg-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#cb212d33] flex items-center justify-center text-[#cb212d] text-xs font-bold">
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
        ))
      )}
    </div>
  );
}