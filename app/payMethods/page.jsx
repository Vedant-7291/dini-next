// app/payMethods/page.jsx
'use client';

import Header from "../components/layout/Header";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useCart } from '../CartContext';
import { QrCode, Loader2, CreditCard, ExternalLink } from 'lucide-react';

const PayMethodsPage = () => {
  const router = useRouter();
  const [method, setMethod] = useState("upi");
  const [showPopup, setShowPopup] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const { getCartTotal, clearCart, cartItems, createOrder } = useCart();

  // QR Code states
  const [isLoading, setIsLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [upiLink, setUpiLink] = useState('');
  const [activeUpi, setActiveUpi] = useState(null);
  const [showAppSelector, setShowAppSelector] = useState(false);

  // Get total amount from cart
  const amount = getCartTotal();

  // Fetch active UPI ID from localStorage and listen for changes
  useEffect(() => {
    const fetchActiveUpi = () => {
      try {
        // Try to get from localStorage (where UPI Management stores it)
        const storedActiveUpi = localStorage.getItem('activeUpi');
        if (storedActiveUpi) {
          const parsedUpi = JSON.parse(storedActiveUpi);
          setActiveUpi(parsedUpi);
        } else {
          // Fallback to default if nothing is stored
          setActiveUpi({
            id: "investingtradingg@ybl",
            businessName: "Restaurant Payment",
            status: "active"
          });
        }
      } catch (error) {
        console.error("Error fetching active UPI:", error);
        // Fallback to default
        setActiveUpi({
          id: "investingtradingg@ybl",
          businessName: "Restaurant Payment",
          status: "active"
        });
      }
    };

    fetchActiveUpi();
    
    // Listen for changes to active UPI (if other tabs update it)
    const handleStorageChange = (e) => {
      if (e.key === 'activeUpi') {
        try {
          if (e.newValue) {
            setActiveUpi(JSON.parse(e.newValue));
          } else {
            // If activeUpi was removed, fallback to default
            setActiveUpi({
              id: "investingtradingg@ybl",
              businessName: "Restaurant Payment",
              status: "active"
            });
          }
        } catch (error) {
          console.error("Error parsing updated UPI:", error);
        }
      }
    };
    
    // Listen for custom event for same-tab changes
    const handleCustomStorageChange = () => {
      try {
        const storedActiveUpi = localStorage.getItem('activeUpi');
        if (storedActiveUpi) {
          setActiveUpi(JSON.parse(storedActiveUpi));
        } else {
          setActiveUpi({
            id: "investingtradingg@ybl",
            businessName: "Restaurant Payment",
            status: "active"
          });
        }
      } catch (error) {
        console.error("Error handling custom storage change:", error);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('activeUpiChanged', handleCustomStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('activeUpiChanged', handleCustomStorageChange);
    };
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handlePaymentSuccess = async () => {
    try {
      setProcessing(true);
      setError(null);
      
      // Generate a random table number
      const tableNumber = Math.floor(1000 + Math.random() * 9000).toString();
      
      console.log('Creating order with:', {
        tableNumber,
        items: cartItems,
        totalAmount: amount,
        paymentMethod: method
      });

      // Create order using CartContext
      await createOrder({
        tableNumber,
        items: cartItems,
        totalAmount: amount,
        paymentMethod: method
      });
      
      // Clear cart only after successful payment
      clearCart();
      
      setShowPopup(true);
    } catch (error) {
      console.error('Error processing payment:', error);
      setError(`Failed to process payment: ${error.message}`);
      alert('Failed to process payment. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Generate QR code function with proper UPI deep link
  const generateQR = () => {
    if (!amount || amount <= 0) {
      console.error('Invalid amount:', amount);
      return;
    }

    if (!activeUpi || !activeUpi.id) {
      console.error('No active UPI ID available');
      return;
    }

    setIsLoading(true);

    const upiId = activeUpi.id;
    const businessName = activeUpi.businessName || "Restaurant Payment";
    
    // Create UPI deep link that opens directly in payment apps with pre-filled amount
    const upiLinkData = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(businessName)}&am=${amount}&cu=INR&tn=Food+Order+Payment`;
    
    setUpiLink(upiLinkData);

    // Generate QR code with UPI standard format
    const qrData = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(businessName)}&am=${amount}&cu=INR&tn=Food+Order+Payment`;
    const qrAPI = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrData)}`;
    
    setQrCodeUrl(qrAPI);
    
    // Simulate loading for better UX
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  // Auto-generate QR code when amount or active UPI changes
  useEffect(() => {
    if (method === "upi" && amount > 0 && activeUpi) {
      generateQR();
    }
  }, [amount, method, activeUpi]);

  // Open UPI app selector
  const openUPIAppSelector = () => {
    setShowAppSelector(true);
  };

  // Handle payment via specific UPI app
  const handleUPIPayment = (app) => {
    if (!upiLink) {
      console.error('No UPI link available');
      return;
    }

    let appLink = upiLink;
    
    // Modify the UPI link based on the selected app
    if (app === 'phonepe') {
      appLink = upiLink.replace('upi://pay', 'phonepe://pay');
    } else if (app === 'gpay') {
      appLink = upiLink.replace('upi://pay', 'tez://upi/pay');
    }
    
    // Try to open the app directly
    window.location.href = appLink;
    
    // Fallback: Open in new tab after a delay if app is not installed
    setTimeout(() => {
      if (!document.hidden) {
        window.open(upiLink, '_blank');
      }
    }, 500);
    
    setShowAppSelector(false);
  };

  // Handle cash payment
  const handleCashPayment = async () => {
    try {
      setProcessing(true);
      setError(null);
      
      // Generate a random table number
      const tableNumber = Math.floor(1000 + Math.random() * 9000).toString();
      
      console.log('Creating cash order with:', {
        tableNumber,
        items: cartItems,
        totalAmount: amount,
        paymentMethod: 'cash'
      });

      // Create order using CartContext
      await createOrder({
        tableNumber,
        items: cartItems,
        totalAmount: amount,
        paymentMethod: 'cash'
      });
      
      // Clear cart only after successful payment
      clearCart();
      
      setShowPopup(true);
    } catch (error) {
      console.error('Error processing cash payment:', error);
      setError(`Failed to process cash payment: ${error.message}`);
      alert('Failed to process payment. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <Header />

      <div className="md:mx-auto md:max-w-[80%] bg-white flex flex-col min-h-screen">
        {/* Header Bar */}
        <div className="bg-[#cb212d] flex items-center gap-3 text-white text-start py-3 px-4 mx-3 rounded-lg mt-3">
          <button onClick={handleBack} className="text-xl cursor-pointer flex">
            <i className="ri-arrow-left-line"></i>
            <h1 className="text-lg px-2 font-semibold cursor-pointer">Checkout</h1>
          </button>
        </div>

        {/* Payment Section */}
        <div className="rounded-lg border border-[#d9d9d9] bg-[#ede9e9] p-6 m-4 flex-1">
          <h2 className="mb-4 text-xl font-semibold">Payment Method</h2>

          {/* Error Display */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Total Amount Display */}
          <div className="bg-white rounded-lg p-4 mb-5 border border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Total Amount:</span>
              <span className="text-xl font-bold text-[#cb212d]">₹{amount}</span>
            </div>
          </div>

          {/* Payment Method Options */}
          <div className="space-y-3 mb-5">
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-lg hover:bg-gray-50">
              <input
                type="radio"
                name="method"
                value="upi"
                checked={method === "upi"}
                onChange={() => setMethod("upi")}
                className="accent-[#cb212d]"
                disabled={amount === 0}
              />
              <span className="flex items-center gap-2 text-gray-700">
                <i className="ri-smartphone-line text-lg"></i>
                UPI Payment
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-lg hover:bg-gray-50">
              <input
                type="radio"
                name="method"
                value="cash"
                checked={method === "cash"}
                onChange={() => setMethod("cash")}
                className="accent-[#cb212d]"
                disabled={amount === 0}
              />
              <span className="flex items-center gap-2 text-gray-700">
                <i className="ri-money-rupee-circle-line text-lg"></i>
                Cash Payment
              </span>
            </label>
          </div>

          {/* UPI Payment Component */}
          {method === "upi" && amount > 0 && (
            <div className="bg-white rounded-lg p-6 space-y-6">
              <div className="text-center">
                <div className="inline-block p-3 bg-blue-50 rounded-full mb-4">
                  <QrCode className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">UPI Payment</h3>
                <p className="text-gray-500 mt-2">Scan the QR code or click below to pay instantly</p>
                
                {/* Show active UPI ID info */}
                {activeUpi && (
                  <div className="mt-3 bg-gray-50 p-3 rounded-lg inline-block">
                    <p className="text-sm text-gray-600">
                      Pay to: <span className="font-medium">{activeUpi.id}</span>
                    </p>
                    {activeUpi.businessName && (
                      <p className="text-xs text-gray-500 mt-1">
                        {activeUpi.businessName}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  {isLoading && (
                    <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10 rounded-lg">
                      <Loader2 className="w-12 h-12 animate-spin text-[#cb212d]" />
                    </div>
                  )}
                  {qrCodeUrl && (
                    <img
                      src={qrCodeUrl}
                      alt="Payment QR Code"
                      className="w-64 h-64 md:w-80 md:h-80 object-contain border-2 border-gray-300 rounded-lg shadow-md"
                    />
                  )}
                </div>

                {/* Payment Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 w-full max-w-md">
                  <h4 className="font-semibold text-blue-800 mb-2">How to pay:</h4>
                  <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
                    <li>Open your UPI app (Google Pay, PhonePe, Paytm, etc.)</li>
                    <li>Tap on "Scan QR Code"</li>
                    <li>Scan the QR code above</li>
                    <li>Confirm the payment details and complete the transaction</li>
                  </ol>
                </div>
              </div>

              <div className="space-y-4 max-w-md mx-auto">
                <button
                  onClick={openUPIAppSelector}
                  disabled={isLoading || processing}
                  className="w-full bg-[#00bf63] text-white py-3 rounded-lg font-medium hover:bg-[#00a758] transition-colors disabled:bg-[#00bf6380] disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  {processing ? 'Processing...' : `Pay with UPI (₹${amount})`}
                </button>
                
                <button
                  onClick={generateQR}
                  className="w-full border border-[#cb212d] text-[#cb212d] py-2 rounded-lg font-medium hover:bg-[#cb212d10] transition-colors flex items-center justify-center gap-2"
                >
                  <i className="ri-refresh-line"></i>
                  Refresh QR Code
                </button>
              </div>

              <div className="text-center text-sm text-gray-500">
                Secure payments powered by UPI
              </div>
            </div>
          )}
          
          {/* Cash Payment Component */}
          {method === "cash" && amount > 0 && (
            <div className="bg-white rounded-lg p-6 space-y-6">
              <div className="text-center">
                <div className="inline-block p-3 bg-green-50 rounded-full mb-4">
                  <i className="ri-money-rupee-circle-line text-3xl text-green-600"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Cash Payment</h3>
                <p className="text-gray-500 mt-2">Pay with cash when your order is served</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <i className="ri-information-line text-yellow-600 text-xl mt-0.5"></i>
                  <div>
                    <h4 className="font-semibold text-yellow-800">Payment Instructions</h4>
                    <p className="text-yellow-700 text-sm mt-1">
                      Please have the exact amount ready. Your total is <strong>₹{amount}</strong>. 
                      Payment will be collected when your food is served.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCashPayment}
                disabled={processing}
                className="w-full bg-[#00bf63] text-white py-3 rounded-lg font-medium hover:bg-[#00a758] transition-colors disabled:bg-[#00bf6380] disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="ri-check-line"></i>
                    Confirm Cash Payment
                  </>
                )}
              </button>
            </div>
          )}

          {/* Show message if amount is 0 */}
          {amount === 0 && (
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="inline-block p-3 bg-gray-100 rounded-full mb-4">
                <i className="ri-shopping-cart-line text-3xl text-gray-500"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-4">Please add items to your cart before proceeding to payment.</p>
              <button
                onClick={() => router.push('/')}
                className="bg-[#cb212d] text-white py-2 px-6 rounded-lg font-medium hover:bg-[#b81d28] transition-colors"
              >
                Browse Menu
              </button>
            </div>
          )}
        </div>
      </div>

      {/* UPI App Selector Popup */}
      {showAppSelector && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg max-w-sm w-full relative">
            <button 
              onClick={() => setShowAppSelector(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
            
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold mb-2">Choose Payment App</h2>
              <p className="text-gray-600">Select your preferred UPI app to complete payment</p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => handleUPIPayment('phonepe')}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold">P</span>
                  </div>
                  <span className="font-medium">PhonePe</span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </button>
              
              <button
                onClick={() => handleUPIPayment('gpay')}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">G</span>
                  </div>
                  <span className="font-medium">Google Pay</span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </button>
              
              <button
                onClick={() => handleUPIPayment('other')}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="ri-bank-card-line text-green-600"></i>
                  </div>
                  <span className="font-medium">Other UPI Apps</span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="mt-6 text-center text-sm text-gray-500">
              Payment will open in your selected app with pre-filled details
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg max-w-sm w-full relative">
            <div className="flex justify-center mb-4">
              <i className="ri-check-line text-green-500 text-4xl"></i>
            </div>
            <h2 className="text-xl font-bold text-center mb-2">Order Successful!</h2>
            <p className="text-gray-600 text-center mb-4">
              Your food will be served in a while. Please wait a moment.
            </p>
            <button
              onClick={() => {
                setShowPopup(false);
                router.push('/');
              }}
              className="w-full bg-[#cb212d] text-white font-semibold py-3 rounded-md hover:bg-[#b81d28] transition-colors"
            >
              Go Back to Menu
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PayMethodsPage;