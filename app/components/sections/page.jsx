// components/sections/page.jsx
"use client";
import { useCart } from "../../CartContext";
const DepositUPI = ({ showPopup, setShowPopup }) => {
  const { getCartTotal } = useCart();
  const amount = getCartTotal().toString();
  const upiId = "developer.aditya09@oksbi";
  const businessName = "Aditya Patel";

  return (
    <div className="mt-2 rounded-lg p-4 text-black relative">
      {/* Header */}
      <div className="mb-2">
        <h2 className="text-lg font-semibold">Pay via UPI</h2>
        <p className="text-sm">Complete your payment using UPI</p>
      </div>

      
      <div className="mb-4 p-4 bg-white rounded-md border border-[#d9d9d9]">
        <label className="block text-sm font-medium mb-2">
          Total Amount <span className="font-semibold">(INR)</span>
        </label>
        <div className="text-2xl font-bold text-[#cb212d]">₹{amount}</div>
      </div>

      {/* UPI Details */}
      <div className="flex flex-col items-center space-y-2">
        <div className="text-center space-y-1 w-full">
          <div className="bg-white rounded-md border border-[#d9d9d9] p-2">
            <p className="text-black">
              <b>UPI ID: </b> {upiId}
            </p>
          </div>
          <div className="bg-white rounded-md border border-[#d9d9d9] p-2">
            <p className="text-black">
              <b>Business Name: </b> {businessName}
            </p>
          </div>
          <div className="bg-white rounded-md border border-[#d9d9d9] p-2">
            <p className="text-black font-semibold">Amount to Pay: ₹{amount}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full space-y-2 mt-4">
          <button
            
            className="flex items-center justify-center gap-2 w-full bg-[#cb212d] text-white py-3 rounded-md transition font-medium"
          >
            Pay Now via UPI
          </button>
          <button
            onClick={() => setShowPopup(true)}
            className="w-full border border-[#cb212d] text-[#cb212d] py-3 rounded-md bg-white transition font-medium cursor-pointer"
          >
            I've Completed Payment
          </button>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg max-w-sm w-full relative">
            <div className="flex justify-center mb-4">
              <i className="ri-check-line text-green-500 text-4xl"></i>
            </div>
            <h2 className="text-xl font-bold text-center mb-2">
              Order Successful!
            </h2>
            <p className="text-gray-600 text-center mb-4">
              your food will be served in a while please wait a moment
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="w-full bg-[#cb212d] text-white font-semibold py-3 rounded-md"
            >
              <a href="/">Go Back to Menu</a>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepositUPI;
