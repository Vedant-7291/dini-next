// UPI Management page.jsx
'use client'

import { FiCreditCard, FiEdit, FiTrash2, FiCheckCircle, FiXCircle, FiPlus, FiSave, FiX } from 'react-icons/fi';
import { useState, useEffect } from 'react';

export default function UPIManagement() {
  const [upiId, setUpiId] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [activeUpi, setActiveUpi] = useState({
    id: '',
    businessName: '',
    status: 'inactive'
  });
  
  const [upiList, setUpiList] = useState([
    { id: 1, upiId: 'yourname@ybl', businessName: 'My Restaurant', status: 'active', isEditing: false },
    { id: 2, upiId: 'backup@ybl', businessName: 'My Restaurant Backup', status: 'inactive', isEditing: false },
    { id: 3, upiId: 'oldaccount@ybl', businessName: 'Old Account', status: 'inactive', isEditing: false }
  ]);

  const [editingUpi, setEditingUpi] = useState(null);

  // Initialize from localStorage on component mount
  useEffect(() => {
    const storedUpiList = localStorage.getItem('upiList');
    const storedActiveUpi = localStorage.getItem('activeUpi');
    
    if (storedUpiList) {
      try {
        setUpiList(JSON.parse(storedUpiList));
      } catch (error) {
        console.error("Error parsing stored UPI list:", error);
      }
    }
    
    if (storedActiveUpi) {
      try {
        setActiveUpi(JSON.parse(storedActiveUpi));
      } catch (error) {
        console.error("Error parsing stored active UPI:", error);
      }
    } else {
      // Initialize active UPI if there's an active one in the list
      const active = upiList.find(upi => upi.status === 'active');
      if (active) {
        const newActiveUpi = {
          id: active.upiId,
          businessName: active.businessName,
          status: 'active'
        };
        setActiveUpi(newActiveUpi);
        localStorage.setItem('activeUpi', JSON.stringify(newActiveUpi));
      }
    }
  }, []);

  // Store UPI list in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('upiList', JSON.stringify(upiList));
  }, [upiList]);

  // Store active UPI in localStorage whenever it changes
  useEffect(() => {
    if (activeUpi.status === 'active') {
      localStorage.setItem('activeUpi', JSON.stringify(activeUpi));
      // Dispatch event for other components to listen to
      window.dispatchEvent(new Event('activeUpiChanged'));
    } else {
      localStorage.removeItem('activeUpi');
      window.dispatchEvent(new Event('activeUpiChanged'));
    }
  }, [activeUpi]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (upiId && businessName) {
      const newUpi = {
        id: Date.now(), // Use timestamp for unique ID
        upiId,
        businessName,
        status: 'inactive',
        isEditing: false
      };
      const updatedList = [...upiList, newUpi];
      setUpiList(updatedList);
      setUpiId('');
      setBusinessName('');
    }
  };

  const activateUpi = (id) => {
    const updatedList = upiList.map(upi => ({
      ...upi,
      status: upi.id === id ? 'active' : 'inactive'
    }));
    setUpiList(updatedList);
    
    const activatedUpi = updatedList.find(upi => upi.id === id);
    if (activatedUpi) {
      const newActiveUpi = {
        id: activatedUpi.upiId,
        businessName: activatedUpi.businessName,
        status: 'active'
      };
      setActiveUpi(newActiveUpi);
    }
  };

  const deactivateUpi = () => {
    const updatedList = upiList.map(upi => ({
      ...upi,
      status: 'inactive'
    }));
    setUpiList(updatedList);
    
    const inactiveUpi = {
      id: '',
      businessName: '',
      status: 'inactive'
    };
    setActiveUpi(inactiveUpi);
  };

  const deleteUpi = (id) => {
    const updatedList = upiList.filter(upi => upi.id !== id);
    setUpiList(updatedList);
    
    // If we're deleting the active UPI, clear the active UPI
    if (activeUpi.id === upiList.find(upi => upi.id === id)?.upiId) {
      const inactiveUpi = {
        id: '',
        businessName: '',
        status: 'inactive'
      };
      setActiveUpi(inactiveUpi);
    }
  };

  const handleEdit = (upi) => {
    const updatedList = upiList.map(item => 
      item.id === upi.id 
        ? { ...item, isEditing: true, editUpiId: item.upiId, editBusinessName: item.businessName }
        : { ...item, isEditing: false }
    );
    setUpiList(updatedList);
    setEditingUpi(upi.id);
  };

  const handleSaveEdit = (upi) => {
    const updatedList = upiList.map(item =>
      item.id === upi.id
        ? { 
            ...item, 
            upiId: item.editUpiId, 
            businessName: item.editBusinessName,
            isEditing: false 
          }
        : item
    );
    setUpiList(updatedList);
    setEditingUpi(null);
    
    // Update active UPI if it was edited
    if (activeUpi.id === upi.upiId) {
      const updatedUpi = updatedList.find(item => item.id === upi.id);
      const newActiveUpi = {
        id: updatedUpi.upiId,
        businessName: updatedUpi.businessName,
        status: 'active'
      };
      setActiveUpi(newActiveUpi);
    }
  };

  const cancelEdit = (upi) => {
    const updatedList = upiList.map(item =>
      item.id === upi.id
        ? { ...item, isEditing: false }
        : item
    );
    setUpiList(updatedList);
    setEditingUpi(null);
  };

  const updateEditableField = (upiId, field, value) => {
    const updatedList = upiList.map(item =>
      item.id === upiId
        ? { ...item, [field]: value }
        : item
    );
    setUpiList(updatedList);
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Main Header */}
      <div className="border-b border-black pb-2">
        <h1 className="text-xl lg:text-2xl font-bold text-black">Add or Update UPI</h1>
      </div>

      {/* UPI Details Form */}
      <div className="space-y-4">
        <h2 className="text-lg lg:text-xl font-semibold text-gray-800">UPI Details</h2>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#cb212d33] focus:border-[#cb212d] outline-none transition cursor-text"
                  placeholder="e.g., yourname@ybl"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#cb212d33] focus:border-[#cb212d] outline-none transition cursor-text"
                  placeholder="e.g., My Restaurant"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button 
                type="submit"
                className="px-4 py-2 bg-[#00bf63] text-white rounded-md hover:bg-[#00a758] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <FiPlus /> Add UPI ID
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Currently Active UPI - Centered when no active UPI */}
      <div className="space-y-4">
        <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Currently Active UPI ID</h2>
        
        {activeUpi.status === 'active' ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#00bf6333] flex items-center justify-center text-[#00bf63] text-xl">
                  <FiCreditCard />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm lg:text-base">UPI ID: {activeUpi.id}</h3>
                  <p className="text-gray-600 text-sm lg:text-base">Business: {activeUpi.businessName}</p>
                  <div className="mt-2">
                    <span className="px-2 py-1 bg-[#00bf6333] text-[#00bf63] rounded-full text-xs">
                      Active
                    </span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={deactivateUpi}
                className="px-4 py-2 bg-[#cb212d] text-white hover:bg-[#b81d28] flex items-center justify-center gap-2 transition-colors cursor-pointer text-sm lg:text-base rounded-md"
              >
                <FiXCircle /> Deactivate UPI
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-sm border border-gray-200 p-8 lg:p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-2xl mb-4">
              <FiCreditCard />
            </div>
            <h3 className="font-semibold text-gray-800 text-lg lg:text-xl mb-2">No Active UPI ID</h3>
            <p className="text-gray-600 text-sm lg:text-base max-w-md">
              Activate a UPI ID from the list below to start receiving payments
            </p>
            <div className="mt-4">
              <span className="px-3 py-1.5 bg-[#cb212d33] text-[#cb212d] rounded-full text-xs lg:text-sm">
                Inactive
              </span>
            </div>
          </div>
        )}
      </div>

      {/* UPI List */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg lg:text-xl font-semibold text-gray-800">UPI List</h2>
          <p className="text-gray-600 text-sm">Manage your UPI IDs</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#cb212d33]">
                  <th className="text-left py-2 px-2 lg:py-4 lg:px-6 font-medium text-[#cb212d] border-[#b81d28] cursor-default text-xs lg:text-base">UPI ID</th>
                  <th className="text-left py-2 px-2 lg:py-4 lg:px-6 font-medium text-[#cb212d] border-[#b81d28] cursor-default text-xs lg:text-base">Business Name</th>
                  <th className="text-center py-2 px-2 lg:py-4 lg:px-6 font-medium text-[#cb212d] border-[#b81d28] cursor-default text-xs lg:text-base">Status</th>
                  <th className="text-right py-2 px-2 lg:py-4 lg:px-6 font-medium text-[#cb212d] border-[#b81d28] cursor-default text-xs lg:text-base">Actions</th>
                </tr>
              </thead>
              <tbody>
                {upiList.map((upi) => (
                  <tr key={upi.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-2 px-2 lg:py-4 lg:px-6 font-medium text-gray-800 text-xs lg:text-base">
                      {upi.isEditing ? (
                        <input
                          type="text"
                          value={upi.editUpiId || upi.upiId}
                          onChange={(e) => updateEditableField(upi.id, 'editUpiId', e.target.value)}
                          className="w-full p-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#cb212d33] outline-none text-xs lg:text-base"
                        />
                      ) : (
                        upi.upiId
                      )}
                    </td>
                    <td className="py-2 px-2 lg:py-4 lg:px-6 text-gray-600 text-xs lg:text-base">
                      {upi.isEditing ? (
                        <input
                          type="text"
                          value={upi.editBusinessName || upi.businessName}
                          onChange={(e) => updateEditableField(upi.id, 'editBusinessName', e.target.value)}
                          className="w-full p-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#cb212d33] outline-none text-xs lg:text-base"
                        />
                      ) : (
                        upi.businessName
                      )}
                    </td>
                    <td className="py-2 px-2 lg:py-4 lg:px-6 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs lg:text-sm ${
                        upi.status === 'active' 
                          ? 'bg-[#00bf6333] text-[#00bf63]' 
                          : 'bg-[#cb212d33] text-[#cb212d]'
                      }`}>
                        {upi.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-2 px-2 lg:py-4 lg:px-6">
                      {upi.isEditing ? (
                        <div className="flex justify-end gap-1 lg:gap-3">
                          <button 
                            onClick={() => handleSaveEdit(upi)}
                            className="p-1 text-[#00bf63] hover:text-white hover:bg-[#00bf63] rounded-full transition-colors cursor-pointer"
                            title="Save"
                          >
                            <FiCheckCircle size={14} className="lg:size-4" />
                          </button>
                          <button 
                            onClick={() => cancelEdit(upi)}
                            className="p-1 text-gray-600 hover:text-white hover:bg-gray-600 rounded-full transition-colors cursor-pointer"
                            title="Cancel"
                          >
                            <FiX size={14} className="lg:size-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-1 lg:gap-3">
                          <button 
                            onClick={() => handleEdit(upi)}
                            className="p-1 text-[#00bf63] hover:text-white hover:bg-[#00bf63] rounded-full transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <FiEdit size={14} className="lg:size-4" />
                          </button>
                          
                          {upi.status === 'active' ? (
                            <button 
                              onClick={() => deactivateUpi()}
                              className="p-1 text-[#cb212d] hover:text-white hover:bg-[#cb212d] rounded-full transition-colors cursor-pointer"
                              title="Deactivate"
                            >
                              <FiXCircle size={14} className="lg:size-4" />
                            </button>
                          ) : (
                            <>
                              <button 
                                onClick={() => activateUpi(upi.id)}
                                className="p-1 text-[#00bf63] hover:text-white hover:bg-[#00bf63] rounded-full transition-colors cursor-pointer"
                                title="Activate"
                              >
                                <FiCheckCircle size={14} className="lg:size-4" />
                              </button>
                              <button 
                                onClick={() => deleteUpi(upi.id)}
                                className="p-1 text-[#cb212d] hover:text-white hover:bg-[#cb212d] rounded-full transition-colors cursor-pointer"
                                title="Delete"
                              >
                                <FiTrash2 size={14} className="lg:size-4" />
                              </button>
                            </>
                          )}
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
    </div>
  );
}