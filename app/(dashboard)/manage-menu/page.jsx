import { FiPlus, FiTrash2, FiEdit, FiSave, FiX, FiUpload } from 'react-icons/fi';

export default function ManageMenu() {
  // Hardcoded menu items
  const menuItems = [
    { id: 1, name: 'Burger', price: '$8.50', category: 'Main' },
    { id: 2, name: 'Pizza', price: '$12.00', category: 'Main' },
    { id: 3, name: 'Pasta', price: '$10.00', category: 'Main' },
    { id: 4, name: 'Salad', price: '$8.00', category: 'Starter' },
    { id: 5, name: 'Coke', price: '$4.00', category: 'Drink' },
    { id: 6, name: 'Ice Cream', price: '$6.00', category: 'Dessert' },
  ];

  return (
    <div className="space-y-8 p-0">
      {/* Main Header */}
      <div className="border-b border-black pb-2">
        <h1 className="text-2xl font-bold text-black">Menu Management</h1>
      </div>

      {/* Add New Menu Item Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FiPlus className="text-[#cb212d] text-lg" />
          <h2 className="text-xl font-semibold text-gray-800">Add New Menu Item</h2>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Side - Form Fields */}
            <div className="w-full md:w-2/3 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#cb212d33] focus:border-[#cb212d] outline-none transition"
                  placeholder="e.g., Margherita Pizza"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                    <input
                      type="text"
                      className="w-full pl-8 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#cb212d33] focus:border-[#cb212d] outline-none transition"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#cb212d33] focus:border-[#cb212d] outline-none transition">
                    <option value="Main">Main Course</option>
                    <option value="Starter">Starter</option>
                    <option value="Drink">Drink</option>
                    <option value="Dessert">Dessert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#cb212d33] focus:border-[#cb212d] outline-none transition"
                  placeholder="Brief description of the item..."
                />
              </div>
            </div>

            {/* Right Side - Image Upload */}
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Item Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg h-full min-h-[200px] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                <FiUpload className="text-3xl text-gray-400 mb-2" />
                <p className="text-gray-500 text-center text-sm">Click to upload or drag and drop</p>
                <p className="text-gray-400 text-xs mt-1">PNG, JPG (500×500 recommended)</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 mt-5">
            <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors">
              <FiX /> Reset
            </button>
            <button className="px-4 py-2 bg-[#00bf63] text-white rounded-md hover:bg-[#00a758] flex items-center gap-2 transition-colors">
              <FiSave /> Save Item
            </button>
          </div>
        </div>
      </div>

      {/* Current Menu Items Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FiPlus className="text-[#cb212d] text-lg" />
          <h2 className="text-xl font-semibold text-gray-800">Manage Menu Items</h2>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#cb212d33]">
                  <th className="text-left py-4 px-6 font-medium text-[#cb212d]  border-[#b81d28]">Item Name</th>
                  <th className="text-left py-4 px-6 font-medium text-[#cb212d]  border-[#b81d28]">Price</th>
                  <th className="text-center py-4 px-6 font-medium text-[#cb212d]  border-[#b81d28]">Category</th>
                  <th className="text-right py-4 px-6 font-medium text-[#cb212d]  border-[#b81d28]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-800">{item.name}</td>
                    <td className="py-4 px-6 text-gray-600">{item.price}</td>
                    <td className="py-4 px-6 text-center">
                      <span className="px-3 py-1 bg-[#ede9e9] text-gray-700 rounded-full text-sm text-center">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-end gap-3">
                        <button 
                          className="p-2 text-[#00bf63] hover:text-white hover:bg-[#00bf63] rounded-full transition-colors"
                          title="Edit"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button 
                          className="p-2 text-[#cb212d] hover:text-white hover:bg-[#cb212d] rounded-full transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}