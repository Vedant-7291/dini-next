// Dashboard page.jsx - Made responsive
'use client'

import { FiPieChart, FiClock, FiCheckCircle, FiChevronDown } from 'react-icons/fi';
import { useState } from 'react';

export default function Dashboard() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Today');

  // Hardcoded stats data
  const stats = [
    { title: 'Total Orders', value: '124', icon: <FiPieChart className="text-[#cb212d]" />, color: 'primary' },
    { title: 'Pending Orders', value: '24', icon: <FiClock className="text-[#cb212d]" />, color: 'primary' },
    { title: 'Completed Orders', value: '100', icon: <FiCheckCircle className="text-[#00bf63]" />, color: 'secondary' },
  ];

  // Hardcoded chart data
  const chartData = [
    { day: 'Mon', orders: 20 },
    { day: 'Tue', orders: 35 },
    { day: 'Wed', orders: 25 },
    { day: 'Thu', orders: 40 },
    { day: 'Fri', orders: 50 },
    { day: 'Sat', orders: 60 },
    { day: 'Sun', orders: 45 },
  ];

  const handlePeriodSelect = (period) => {
    setSelectedPeriod(period);
    setIsDropdownOpen(false);
  };

  return (
    <div className="space-y-8 h-auto lg:h-[73vh]">
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-black pb-1 gap-2">
          <h2 className="text-xl lg:text-2xl font-bold flex items-center gap-2">Dashboard Overview</h2>
          <div className="relative self-end lg:self-auto">
            <button 
              className="px-3 py-2 mb-1 bg-[#ede9e9] text-[#cb212d] rounded-md text-sm flex items-center gap-1 hover:bg-[#e6e0e0] transition-colors"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedPeriod}
              <FiChevronDown />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <button 
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-[#ede9e9] text-[#cb212d]"
                  onClick={() => handlePeriodSelect('Weekly')}
                >
                  Weekly
                </button>
                <button 
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-[#ede9e9] text-[#cb212d]"
                  onClick={() => handlePeriodSelect('Monthly')}
                >
                  Monthly
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {stats.map((stat, index) => (
            <div key={index} className={`${stat.color === '#ede9e9' ? 'bg-[#ede9e9]' : 'bg-[#ede9e9]'} p-4 lg:p-6 rounded-lg`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm">{stat.title}</p>
                  <p className="text-xl lg:text-2xl font-bold">{stat.value}</p>
                </div>
                <div className="text-xl lg:text-2xl">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-[#ede9e9] p-4 lg:p-6 rounded-lg">
          <h3 className="font-semibold mb-4">Daily Orders</h3>
          <div className="flex items-end h-32 lg:h-40 gap-1 lg:gap-2">
            {chartData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-[#cb212d33] rounded-t"
                  style={{ height: `${data.orders}%` }}
                ></div>
                <span className="text-xs mt-2">{data.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}