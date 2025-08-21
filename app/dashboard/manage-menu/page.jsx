// Manage Menu page.jsx - Fixed table editing functionality
'use client'

import { FiPlus, FiTrash2, FiEdit, FiSave, FiX, FiUpload, FiCheck, FiArrowLeft } from 'react-icons/fi';
import { useState, useRef } from 'react';

export default function ManageMenu() {
  // State for form fields
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Main');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  const fileInputRef = useRef(null);

  // Hardcoded menu items
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: 'Burger', price: '$8.50', category: 'Main' },
    { id: 2, name: 'Pizza', price: '$12.00', category: 'Main' },
    { id: 3, name: 'Pasta', price: '$10.00', category: 'Main' },
    { id: 4, name: 'Salad', price: '$8.00', category: 'Starter' },
    { id: 5, name: 'Coke', price: '$4.00', category: 'Drink' },
    { id: 6, name: 'Ice Cream', price: '$6.00', category: 'Dessert' },
  ]);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle edit item - Only for table editing
  const handleEdit = (item) => {
    // Create editable versions of the item data
    const editedItems = menuItems.map(menuItem => 
      menuItem.id === item.id 
        ? { ...menuItem, isEditing: true, editName: menuItem.name, editPrice: menuItem.price.replace('$', ''), editCategory: menuItem.category }
        : { ...menuItem, isEditing: false }
    );
    setMenuItems(editedItems);
  };

  // Handle save edited item in table
  const handleSaveEdit = (item) => {
    const updatedItems = menuItems.map(menuItem =>
      menuItem.id === item.id
        ? { 
            ...menuItem, 
            name: menuItem.editName, 
            price: `$${menuItem.editPrice}`, 
            category: menuItem.editCategory,
            isEditing: false 
          }
        : menuItem
    );
    setMenuItems(updatedItems);
  };

  // Cancel edit in table
  const cancelEdit = (item) => {
    const updatedItems = menuItems.map(menuItem =>
      menuItem.id === item.id
        ? { ...menuItem, isEditing: false }
        : menuItem
    );
    setMenuItems(updatedItems);
  };

  // Handle delete item from table
  const handleDelete = (id) => {
    const updatedItems = menuItems.filter(item => item.id !== id);
    setMenuItems(updatedItems);
    setDeleteConfirm(null);
  };

  // Handle add new item from form
  const handleAddItem = () => {
    const newItem = {
      id: Math.max(...menuItems.map(item => item.id)) + 1,
      name: itemName,
      price: `$${price}`,
      category,
      isEditing: false
    };
    setMenuItems([...menuItems, newItem]);
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setItemName('');
    setPrice('');
    setCategory('Main');
    setImage(null);
    setImagePreview(null);
  };

  // Update editable field in table
  const updateEditableField = (itemId, field, value) => {
    const updatedItems = menuItems.map(item =>
      item.id === itemId
        ? { ...item, [field]: value }
        : item
    );
    setMenuItems(updatedItems);
  };

  return (
    <div className="space-y-6 lg:space-y-8 p-0">
      {/* Main Header */}
      <div className="border-b border-black pb-2">
        <h1 className="text-xl lg:text-2xl font-bold text-black">Menu Management</h1>
      </div>

      {/* Add New Menu Item Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FiPlus className="text-[#cb212d] text-lg" />
          <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Add New Menu Item</h2>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Left Side - Form Fields */}
            <div className="w-full lg:w-2/3 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#cb212d33] focus:border-[#cb212d] outline-none transition cursor-text"
                  placeholder="e.g., Margherita Pizza"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                    <input
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full pl-8 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#cb212d33] focus:border-[#cb212d] outline-none transition cursor-text"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#cb212d33] focus:border-[#cb212d] outline-none transition cursor-pointer"
                  >
                    <option value="Main">Main Course</option>
                    <option value="Starter">Starter</option>
                    <option value="Drink">Drink</option>
                    <option value="Dessert">Dessert</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right Side - Image Upload */}
            <div className="w-full lg:w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Item Image</label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg h-full min-h-[150px] lg:min-h-[200px] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors p-4"
              >
                {imagePreview ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-h-32 max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <>
                    <FiUpload className="text-2xl lg:text-3xl text-gray-400 mb-2" />
                    <p className="text-gray-500 text-center text-sm">Click to upload or drag and drop</p>
                    <p className="text-gray-400 text-xs mt-1 text-center">PNG, JPG (500×500 recommended)</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 mt-5">
            <button 
              onClick={resetForm}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <FiX /> Reset
            </button>
            <button 
              onClick={handleAddItem}
              className="px-4 py-2 bg-[#00bf63] text-white rounded-md hover:bg-[#00a758] flex items-center justify-center gap-2 transition-colors mb-3 sm:mb-0 cursor-pointer"
            >
              <FiSave /> Save Item
            </button>
          </div>
        </div>
      </div>

      {/* Current Menu Items Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FiPlus className="text-[#cb212d] text-lg" />
          <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Manage Menu Items</h2>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#cb212d33]">
                  <th className="text-left py-3 px-4 lg:py-4 lg:px-6 font-medium text-[#cb212d] border-[#b81d28] cursor-default">Item Name</th>
                  <th className="text-left py-3 px-4 lg:py-4 lg:px-6 font-medium text-[#cb212d] border-[#b81d28] cursor-default">Price</th>
                  <th className="text-center py-3 px-4 lg:py-4 lg:px-6 font-medium text-[#cb212d] border-[#b81d28] cursor-default">Category</th>
                  <th className="text-right py-3 px-4 lg:py-4 lg:px-6 font-medium text-[#cb212d] border-[#b81d28] cursor-default">Actions</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 lg:py-4 lg:px-6 font-medium text-gray-800">
                      {item.isEditing ? (
                        <input
                          type="text"
                          value={item.editName}
                          onChange={(e) => updateEditableField(item.id, 'editName', e.target.value)}
                          className="w-full p-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#cb212d33] outline-none"
                        />
                      ) : (
                        item.name
                      )}
                    </td>
                    <td className="py-3 px-4 lg:py-4 lg:px-6 text-gray-600">
                      {item.isEditing ? (
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-1 text-gray-500">$</span>
                          <input
                            type="text"
                            value={item.editPrice}
                            onChange={(e) => updateEditableField(item.id, 'editPrice', e.target.value)}
                            className="w-full pl-6 p-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#cb212d33] outline-none"
                          />
                        </div>
                      ) : (
                        item.price
                      )}
                    </td>
                    <td className="py-3 px-4 lg:py-4 lg:px-6 text-center">
                      {item.isEditing ? (
                        <select
                          value={item.editCategory}
                          onChange={(e) => updateEditableField(item.id, 'editCategory', e.target.value)}
                          className="px-2 py-1 bg-[#ede9e9] text-gray-700 rounded-full text-xs lg:text-sm border border-gray-300 focus:ring-1 focus:ring-[#cb212d33] outline-none cursor-pointer"
                        >
                          <option value="Main">Main</option>
                          <option value="Starter">Starter</option>
                          <option value="Drink">Drink</option>
                          <option value="Dessert">Dessert</option>
                        </select>
                      ) : (
                        <span className="px-2 py-1 bg-[#ede9e9] text-gray-700 rounded-full text-xs lg:text-sm text-center">
                          {item.category}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 lg:py-4 lg:px-6">
                      {item.isEditing ? (
                        <div className="flex justify-end gap-2 lg:gap-3">
                          <button 
                            onClick={() => handleSaveEdit(item)}
                            className="p-1 lg:p-2 text-[#00bf63] hover:text-white hover:bg-[#00bf63] rounded-full transition-colors cursor-pointer"
                            title="Save"
                          >
                            <FiCheck size={16} />
                          </button>
                          <button 
                            onClick={() => cancelEdit(item)}
                            className="p-1 lg:p-2 text-gray-600 hover:text-white hover:bg-gray-600 rounded-full transition-colors cursor-pointer"
                            title="Cancel"
                          >
                            <FiX size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2 lg:gap-3">
                          <button 
                            onClick={() => handleEdit(item)}
                            className="p-1 lg:p-2 text-[#00bf63] hover:text-white hover:bg-[#00bf63] rounded-full transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <FiEdit size={16} />
                          </button>
                          <button 
                            onClick={() => setDeleteConfirm(item.id)}
                            className="p-1 lg:p-2 text-[#cb212d] hover:text-white hover:bg-[#cb212d] rounded-full transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 border border-red-500">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-[#cb212d] text-white rounded-md hover:bg-[#b81d28] transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}