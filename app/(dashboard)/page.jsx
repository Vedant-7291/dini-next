import React from 'react'

const page = () => {
  return (
    <div>
      <button className="px-4 py-2 bg-[#00bf63] text-white rounded flex items-center gap-2">
        <FiCheckCircle /> Completed (100)
      </button>
      <button className="px-4 py-2 bg-[#cb212d] text-white rounded flex items-center gap-2">
        <FiClock /> Pending (24)
      </button>
    </div>
  )
}

export default page
