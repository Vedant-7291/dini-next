// app/dashboard/manage-menu/page.jsx
'use client'

import { FiPlus, FiTrash2, FiEdit, FiSave, FiX, FiUpload, FiCheck, FiRefreshCw, FiFilter } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';

export default function ManageMenu() {
  // State for form fields
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Main');
  const [preparationTime, setPreparationTime] = useState(10);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  // Fetch menu items on component mount
  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Filter menu items when categoryFilter or menuItems change
  useEffect(() => {
    if (categoryFilter === 'All') {
      setFilteredItems(menuItems);
    } else {
      setFilteredItems(menuItems.filter(item => item.category === categoryFilter));
    }
  }, [categoryFilter, menuItems]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/menu');
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data);
        setFilteredItems(data);
      } else {
        setError('Failed to fetch menu items');
      }
    } catch (error) {
      setError('Error fetching menu items');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

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

  // Handle edit image upload
  const handleEditImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle edit item
  const handleEdit = (item) => {
    setEditingItem({
      _id: item._id,
      editName: item.name,
      editPrice: item.price.toString(),
      editCategory: item.category,
      editPreparationTime: item.preparationTime || 10
    });
    setImagePreview(null); // Reset image preview when starting edit
  };

  // Handle save edited item
  const handleSaveEdit = async () => {
    try {
      setLoading(true);
      setError('');
      
      const formData = new FormData();
      formData.append('name', editingItem.editName);
      formData.append('price', editingItem.editPrice);
      formData.append('category', editingItem.editCategory);
      formData.append('preparationTime', editingItem.editPreparationTime);
      
      // Only append image if a new one was selected
      if (imagePreview && editFileInputRef.current?.files[0]) {
        formData.append('image', editFileInputRef.current.files[0]);
      }

      const response = await fetch(`http://localhost:5000/api/menu/${editingItem._id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        setSuccess('Menu item updated successfully!');
        setEditingItem(null);
        setImagePreview(null);
        await fetchMenuItems();
      } else {
        setError('Failed to update menu item');
      }
    } catch (error) {
      setError('Error updating menu item');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingItem(null);
    setImagePreview(null);
  };

  // Handle delete item
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`http://localhost:5000/api/menu/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Menu item deleted successfully!');
        await fetchMenuItems();
      } else {
        setError('Failed to delete menu item');
      }
    } catch (error) {
      setError('Error deleting menu item');
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setDeleteConfirm(null);
    }
  };

  // Handle add new item
  const handleAddItem = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!itemName || !price) {
        setError('Please fill in all required fields');
        return;
      }

      const formData = new FormData();
      formData.append('name', itemName);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('preparationTime', preparationTime);
      
      // Only append image if one was selected
      if (image) {
        formData.append('image', image);
      }

      const response = await fetch('http://localhost:5000/api/menu', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSuccess('Menu item added successfully!');
        resetForm();
        await fetchMenuItems();
      } else {
        setError('Failed to add menu item');
      }
    } catch (error) {
      setError('Error adding menu item');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setItemName('');
    setPrice('');
    setCategory('Main');
    setPreparationTime(10);
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Update editable field
  const updateEditableField = (field, value) => {
    setEditingItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6 lg:space-y-8 p-0">
      {/* Main Header */}
      <div className="border-b border-black pb-2">
        <h1 className="text-xl lg:text-2xl font-bold text-black">Menu Management</h1>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

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
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#cb212d33] focus:border-[#cb212d] outline-none transition cursor-text"
                  placeholder="e.g., Margherita Pizza"
                  required
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full pl-8 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#cb212d33] focus:border-[#cb212d] outline-none transition cursor-text"
                      placeholder="0.00"
                      required
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
                    <option value="pizza">Pizza</option>
                    <option value="fries">French Fries</option>
                    <option value="burger">Burger</option>
                    <option value="maggie">Maggie</option>
                    <option value="pasta">Pasta</option>
                    <option value="salad">Salad</option>
                    <option value="sandwich">Sandwich</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preparation Time (minutes)</label>
                  <input
                    type="number"
                    value={preparationTime}
                    onChange={(e) => setPreparationTime(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#cb212d33] focus:border-[#cb212d] outline-none transition cursor-text"
                    placeholder="10"
                  />
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
              disabled={loading}
              className="px-4 py-2 bg-[#00bf63] text-white rounded-md hover:bg-[#00a758] flex items-center justify-center gap-2 transition-colors mb-3 sm:mb-0 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Adding...' : <><FiPlus /> Add Item</>}
            </button>
          </div>
        </div>
      </div>

      {/* Current Menu Items Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiPlus className="text-[#cb212d] text-lg" />
            <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Manage Menu Items</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#ede9e9] rounded-md px-3 py-2">
              <FiFilter className="text-gray-600" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-transparent border-none outline-none text-sm cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Main">Main Course</option>
                <option value="Starter">Starter</option>
                <option value="Drink">Drink</option>
                <option value="Dessert">Dessert</option>
                <option value="pizza">Pizza</option>
                <option value="fries">French Fries</option>
                <option value="burger">Burger</option>
                <option value="maggie">Maggie</option>
                <option value="pasta">Pasta</option>
                <option value="salad">Salad</option>
                <option value="sandwich">Sandwich</option>
              </select>
            </div>
            <button
              onClick={fetchMenuItems}
              className="flex items-center gap-2 px-3 py-2 bg-[#ede9e9] rounded-md hover:bg-gray-200 transition-colors"
            >
              <FiRefreshCw /> Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cb212d] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading menu items...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#cb212d33]">
                    <th className="text-left py-2 px-2 lg:py-4 lg:px-6 font-medium text-[#cb212d] border-[#b81d28] cursor-default text-xs lg:text-base">Item Name</th>
                    <th className="text-left py-2 px-2 lg:py-4 lg:px-6 font-medium text-[#cb212d] border-[#b81d28] cursor-default text-xs lg:text-base">Price</th>
                    <th className="text-center py-2 px-2 lg:py-4 lg:px-6 font-medium text-[#cb212d] border-[#b81d28] cursor-default text-xs lg:text-base">Category</th>
                    
                    <th className="text-right py-2 px-2 lg:py-4 lg:px-6 font-medium text-[#cb212d] border-[#b81d28] cursor-default text-xs lg:text-base">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-2 px-2 lg:py-4 lg:px-6 font-medium text-gray-800 text-xs lg:text-base">
                        {editingItem?._id === item._id ? (
                          <input
                            type="text"
                            value={editingItem.editName}
                            onChange={(e) => updateEditableField('editName', e.target.value)}
                            className="w-full p-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#cb212d33] outline-none text-xs lg:text-base"
                          />
                        ) : (
                          <span className="text-xs lg:text-base">{item.name}</span>
                        )}
                      </td>
                      <td className="py-2 px-2 lg:py-4 lg:px-6 text-gray-600 text-xs lg:text-base">
                        {editingItem?._id === item._id ? (
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-1 text-gray-500 text-xs lg:text-base">$</span>
                            <input
                              type="number"
                              step="0.01"
                              value={editingItem.editPrice}
                              onChange={(e) => updateEditableField('editPrice', e.target.value)}
                              className="w-full pl-5 p-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#cb212d33] outline-none text-xs lg:text-base"
                            />
                          </div>
                        ) : (
                          <span className="text-xs lg:text-base">${item.price}</span>
                        )}
                      </td>
                      <td className="py-2 px-2 lg:py-4 lg:px-6 text-center">
                        {editingItem?._id === item._id ? (
                          <select
                            value={editingItem.editCategory}
                            onChange={(e) => updateEditableField('editCategory', e.target.value)}
                            className="px-1 py-0.5 lg:px-2 lg:py-1 bg-[#ede9e9] text-gray-700 rounded-full text-xs lg:text-sm border border-gray-300 focus:ring-1 focus:ring-[#cb212d33] outline-none cursor-pointer"
                          >
                            <option value="Main">Main</option>
                            <option value="Starter">Starter</option>
                            <option value="Drink">Drink</option>
                            <option value="Dessert">Dessert</option>
                            <option value="pizza">Pizza</option>
                            <option value="fries">Fries</option>
                            <option value="burger">Burger</option>
                            <option value="maggie">Maggie</option>
                            <option value="pasta">Pasta</option>
                            <option value="salad">Salad</option>
                            <option value="sandwich">Sandwich</option>
                          </select>
                        ) : (
                          <span className="px-1 py-0.5 lg:px-2 lg:py-1 bg-[#ede9e9] text-gray-700 rounded-full text-xs lg:text-sm text-center">
                            {item.category}
                          </span>
                        )}
                      </td>
                     
                     
                      <td className="py-2 px-2 lg:py-4 lg:px-6">
                        {editingItem?._id === item._id ? (
                          <div className="flex justify-end gap-1 lg:gap-3">
                            <button 
                              onClick={handleSaveEdit}
                              disabled={loading}
                              className="p-1 text-[#00bf63] hover:text-white hover:bg-[#00bf63] rounded-full transition-colors cursor-pointer disabled:opacity-50"
                              title="Save"
                            >
                              <FiCheck size={14} className="lg:size-4" />
                            </button>
                            <button 
                              onClick={cancelEdit}
                              className="p-1 text-gray-600 hover:text-white hover:bg-gray-600 rounded-full transition-colors cursor-pointer"
                              title="Cancel"
                            >
                              <FiX size={14} className="lg:size-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-1 lg:gap-3">
                            <button 
                              onClick={() => handleEdit(item)}
                              className="p-1 text-[#00bf63] hover:text-white hover:bg-[#00bf63] rounded-full transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <FiEdit size={14} className="lg:size-4" />
                            </button>
                            <button 
                              onClick={() => setDeleteConfirm(item._id)}
                              className="p-1 text-[#cb212d] hover:text-white hover:bg-[#cb212d] rounded-full transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <FiTrash2 size={14} className="lg:size-4" />
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
        )}
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
                disabled={loading}
                className="px-4 py-2 bg-[#cb212d] text-white rounded-md hover:bg-[#b81d28] transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}