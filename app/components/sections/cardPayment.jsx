const CardPayment = ({ setShowPopup }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Card Number</label>
        <input
          type="text"
          placeholder="1234 5678 1234 XXXX"
          className="w-full rounded-md bg-white border-2 border-[#d9d9d9] p-3 text-sm focus:outline-none focus:border-[#cb212d]"
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Expiry Date</label>
          <input
            type="text"
            placeholder="MM/YY"
            className="w-full rounded-md bg-white border-2 border-[#d9d9d9] p-3 text-sm focus:outline-none focus:border-[#cb212d]"
          />
        </div>
        <div className="w-28">
          <label className="block text-sm font-medium mb-1">CVV</label>
          <input
            type="password"
            placeholder="123"
            maxLength={3}
            className="w-full rounded-md bg-white border-2 border-[#d9d9d9] p-3 text-sm focus:outline-none focus:border-[#cb212d]"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Name On Card</label>
        <input
          type="text"
          placeholder="Aditya Patel"
          className="w-full rounded-md bg-white border-2 border-[#d9d9d9] p-3 text-sm focus:outline-none focus:border-[#cb212d]"
        />
      </div>

      <button
        onClick={() => setShowPopup(true)}
        className="w-full bg-[#cb212d] text-white py-3 rounded-lg mt-6 font-medium cursor-pointer"
      >
        Pay Now
      </button>
    </div>
  );
};

export default CardPayment;