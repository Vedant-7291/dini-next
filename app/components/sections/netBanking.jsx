const NetBanking = ({ setShowPopup }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Select Bank</label>
        <select className="w-full rounded-md bg-white border-2 border-[#d9d9d9] p-3 text-sm focus:outline-none focus:border-[#cb212d]">
          <option value="">Select your bank</option>
          <option value="sbi">State Bank of India</option>
          <option value="hdfc">HDFC Bank</option>
          <option value="icici">ICICI Bank</option>
          <option value="axis">Axis Bank</option>
          <option value="kotak">Kotak Mahindra Bank</option>
          <option value="bob">Bank of Baroda</option>
          <option value="yes">Yes Bank</option>
          <option value="indusind">IndusInd Bank</option>
        </select>
      </div>

      <div className="text-sm text-gray-500 mt-2">
        <p>You will be redirected to your bank's secure page to complete the payment.</p>
      </div>

      <button
        onClick={() => setShowPopup(true)}
        className="w-full bg-[#cb212d] text-white py-3 rounded-lg mt-6 font-medium cursor-pointer"
      >
        Proceed to Bank
      </button>
    </div>
  );
};

export default NetBanking;