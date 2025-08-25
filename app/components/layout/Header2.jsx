// components/layout/Header.jsx
'use client';

import Link from "next/link";
import { useCart } from '../../CartContext';

const Header = () => {
  const { getCartItemsCount } = useCart();
  
  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-50">
      <h1 className="text-2xl font-bold text-[#cb212d]">SmartDini</h1>
      <Link href="/cart" className="text-3xl cursor-pointer relative">
        <i className="ri-shopping-cart-line"></i>
        {getCartItemsCount() > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#cb212d] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {getCartItemsCount()}
          </span>
        )}
      </Link>
    </div>
  );
};

export default Header;
