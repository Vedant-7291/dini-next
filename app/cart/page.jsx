// app/cart/page.jsx
'use client';

import Image from "next/image";
import Header from "../components/layout/Header2";
import Link from "next/link";
import { useCart } from '../CartContext';
import { useRouter } from "next/navigation";
import { useState } from "react";

const PaymentPage = () => {
  const { cartItems, getCartTotal, clearCart, createOrder } = useCart();
  const router = useRouter();
  const [tableNumber, setTableNumber] = useState("");
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!tableNumber.trim()) {
      setShowError(true);
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        tableNumber,
        items: cartItems,
        totalAmount: getCartTotal(),
        paymentMethod: 'upi' // Default, will be updated in payment page
      };

      await createOrder(orderData);
      router.push('/payMethods');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      
      <div className="min-h-screen md:mx-auto md:max-w-[60%] bg-white flex flex-col">
        {/* Header */}
        <div className="bg-[#cb212d] flex items-center gap-3 text-white text-start py-3 px-4 mx-3 rounded-lg mt-3 ">
          <button onClick={handleBack} className="text-xl cursor-pointer flex">
            <i className="ri-arrow-left-line"></i>
            <h1 className="text-lg px-2 font-semibold cursor-pointer">Checkout</h1>
          </button>
        </div>

        {/* Order Summary */}
        <div className="p-4 flex-1">
          <div className="bg-[#ede9e9] rounded-lg p-4 shadow border-[#d9d9d9] border">
            <h2 className="text-lg font-semibold mb-3">Order Summary</h2>

            {cartItems.length === 0 ? (
              <p className="text-center py-4">Your cart is empty</p>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 relative">
                        <Image
                          src={item.img || '/pngegg.png'}
                          alt={item.name}
                          fill
                          className="rounded-md object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-black">
                          Prepare In <span className="text-red-500">10</span> minutes
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">₹{item.price * item.quantity}</p>
                      <p className="text-xs text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-[#d9d9d9] mt-4 pt-3 flex justify-between text-lg font-semibold">
              <p>Total:</p>
              <p>₹{getCartTotal()}</p>
            </div>
          </div>

          {/* Table Number Input */}
          <div className="mt-6 bg-[#ede9e9] p-4 rounded-lg shadow border-[#d9d9d9] border">
            <h2 className="text-xl font-semibold mb-2">Table Number</h2>
            <p className="text-sm mb-3">Enter your table no.</p>
            <input
              type="text"
              required
              value={tableNumber}
              onChange={(e) => {
                setTableNumber(e.target.value);
                setShowError(false);
              }}
              placeholder="eg: 01"
              className="w-full border-2 rounded-md px-4 py-2 bg-white border-[#d9d9d9] focus:outline-none focus:border-[#cb212d]"
            />
            {showError && (
              <p className="text-red-500 text-sm mt-2">Please enter a table number before proceeding</p>
            )}
          </div>
        </div>

        {/* Make Payment Button */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-white border-t border-gray-200">
            <button
              onClick={handlePayment}
              disabled={loading}
              className={`w-full bg-[#cb212d] text-white py-3 rounded-lg flex justify-center items-center gap-2 font-medium ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#b81d28]'
              }`}
            >
              {loading ? 'Processing...' : 'Make Payment'}
              {!loading && <i className="ri-arrow-right-line"></i>}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default PaymentPage;