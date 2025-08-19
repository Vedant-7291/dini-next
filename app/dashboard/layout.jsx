import '../globals.css'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex">
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
      
      {/* Sidebar */}
      <div className="fixed top-5 left-5 bottom-5 w-64 z-10">
        <Sidebar />
      </div>
      
      {/* Main content */}
      <div className="ml-80 flex-1 p-8">
        <Header />
        <main className="mt-1 bg-white rounded-lg shadow-lg p-6">
          {children}
        </main>
      </div>
    </div>
  )
}