// app/dashboard/page.jsx
'use client'

import { FiPieChart, FiClock, FiCheckCircle, FiChevronDown, FiRefreshCw } from 'react-icons/fi';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Today');
  const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0, completed: 0 });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch order statistics
      const statsResponse = await fetch('https://dini-next-kvwx.vercel.app/api/orders/stats');
      const statsData = statsResponse.ok ? await statsResponse.json() : { total: 0, pending: 0, accepted: 0, completed: 0 };
      
      // For now, using dummy chart data - you can implement real chart data based on your needs
      const dummyChartData = [
        { day: 'Mon', orders: Math.floor(Math.random() * 20) + 10 },
        { day: 'Tue', orders: Math.floor(Math.random() * 20) + 10 },
        { day: 'Wed', orders: Math.floor(Math.random() * 20) + 10 },
        { day: 'Thu', orders: Math.floor(Math.random() * 20) + 10 },
        { day: 'Fri', orders: Math.floor(Math.random() * 20) + 10 },
        { day: 'Sat', orders: Math.floor(Math.random() * 20) + 10 },
        { day: 'Sun', orders: Math.floor(Math.random() * 20) + 10 },
      ];
      
      setStats(statsData);
      setChartData(dummyChartData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Set up polling to refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handlePeriodSelect = (period) => {
    setSelectedPeriod(period);
    setIsDropdownOpen(false);
  };

  // Available periods for dropdown
  const periods = ['Today', 'Weekly', 'Monthly'];

  // Stats data - Show pending, accepted (active), and completed orders
  const statsItems = [
    { title: 'Active Orders', value: stats.pending.toString(), icon: <FiClock className="text-[#cb212d]" />, color: 'primary' },
    { title: 'Pending Orders', value: stats.accepted.toString(), icon: <FiPieChart className="text-[#ffa500]" />, color: 'warning' },
    { title: 'Completed Orders', value: stats.completed.toString(), icon: <FiCheckCircle className="text-[#00bf63]" />, color: 'secondary' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cb212d] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 h-auto lg:h-[73vh]">
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-black pb-1 gap-2">
          <h2 className="text-xl lg:text-2xl font-bold flex items-center gap-2">Dashboard Overview</h2>
          <div className="flex items-center gap-2 self-end lg:self-auto">
            <button 
              onClick={fetchDashboardData}
              className="flex items-center gap-1 px-2 py-1 bg-[#ede9e9] rounded-md hover:bg-gray-200 transition-colors"
            >
              <FiRefreshCw size={14} /> Refresh
            </button>
            <div className="relative">
              <button 
                className="px-3 py-2 mb-1 bg-[#ede9e9] text-[#cb212d] rounded-md text-sm flex items-center gap-1 hover:bg-[#e6e0e0] transition-colors cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {selectedPeriod}
                <FiChevronDown />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  {periods.map((period) => (
                    period !== selectedPeriod && (
                      <button 
                        key={period}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-[#ede9e9] text-[#cb212d] cursor-pointer"
                        onClick={() => handlePeriodSelect(period)}
                      >
                        {period}
                      </button>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {statsItems.map((stat, index) => (
            <div key={index} className="bg-[#ede9e9] p-4 lg:p-6 rounded-lg">
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
                  style={{ height: `${(data.orders / Math.max(...chartData.map(d => d.orders))) * 80}%` }}
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