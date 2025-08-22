import '../globals.css'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Background color sections */}
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute top-0 left-0 right-0 h-[40vh]" 
          style={{ backgroundColor: '#cb212d' }}
        ></div>
        <div 
          className="absolute bottom-0 left-0 right-0 h-[60vh]" 
          style={{ backgroundColor: '#ede9e9' }}
        ></div>
      </div>
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed top-5 left-5 bottom-5 w-64 z-10">
        <Sidebar />
      </div>
      
      {/* Mobile sidebar toggle button */}
      <div className="lg:hidden fixed top-5 left-5 z-50">
        <button 
          id="mobile-sidebar-toggle"
          className="w-12 h-12 bg-white text-[#cb212d] rounded-full flex items-center justify-center shadow-lg text-xl"
        >
          ☰
        </button>
      </div>
      
      {/* Mobile Sidebar (always rendered but hidden by default) */}
      <div className="lg:hidden">
        <Sidebar />
      </div>
      
      {/* Mobile header */}
      <div className="lg:hidden pt-20">
        <Header />
      </div>
      
      {/* Main content */}
      <div className="lg:ml-80 flex-1 p-4 lg:p-8 mt-0">
        <div className="hidden lg:block">
          <Header />
        </div>
        <main className="mt-1 bg-white rounded-lg shadow-lg p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}