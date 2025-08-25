// app/page.js
"use client";
import { useState } from "react";
import Image from "next/image";
import Header from "./components/layout/Header2";
import Link from "next/link";
import { useCart } from "./CartContext";

const Page = () => {
  const {
    addToCart,
    updateQuantity,
    cartItems,
    getCartTotal,
    getCartItemsCount,
    menuItems,
    loading,
  } = useCart();

  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { id: null, name: "All", img: "/pngegg.png" },
    { id: "pizza", name: "Pizza", img: "/pngegg.png" },
    { id: "fries", name: "French Fries", img: "/pngegg.png" },
    { id: "burger", name: "Burger", img: "/pngegg.png" },
    { id: "maggie", name: "Maggie", img: "/pngegg.png" },
    { id: "pasta", name: "Pasta", img: "/pngegg.png" },
    { id: "salad", name: "Salad", img: "/pngegg.png" },
    { id: "sandwich", name: "Sandwich", img: "/pngegg.png" },
  ];

  const filteredItems =
    selectedCategory === null
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  const isItemInCart = (id) => cartItems.some((item) => item._id === id);
  const getItemQuantity = (id) =>
    cartItems.find((item) => item._id === id)?.quantity || 0;

  const handleCategoryClick = (categoryId) => setSelectedCategory(categoryId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cb212d] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white sticky top-0 z-10 border-b-2 border-[#d9d9d9]">
        <Header />

        {/* Banner */}
        <div className="bg-[#cb212d] flex items-center gap-3 text-white text-start p-3 mx-3 rounded-2xl my-3">
          <div className="text-4xl">
            <i className="ri-restaurant-line"></i>
          </div>
          <div>
            <p className="font-semibold text-lg">Scan. Order. Enjoy.</p>
            <p className="text-sm">Where Menus Go Digital.</p>
          </div>
        </div>

        {/* Menu Categories */}
        <div className="py-3 px-4">
          <div className="overflow-x-auto sm:overflow-x-visible">
            <div className="flex p-2 flex-nowrap cursor-pointer">
              {categories.map((item) => (
                <div
                  key={item.id || "all"}
                  onClick={() => handleCategoryClick(item.id)}
                  className={`flex flex-col items-center w-24 flex-shrink-0 
                             ${
                               selectedCategory === item.id
                                 ? "scale-110 shadow-lg"
                                 : ""
                             }`}
                >
                  <div
                    className="w-16 h-16 flex items-center justify-center rounded-xl overflow-hidden bg-cover bg-center"
                    style={{ backgroundImage: `url('${item.img}')` }}
                  ></div>
                  <p
                    className={`mt-2 text-sm text-center ${
                      selectedCategory === item.id
                        ? "font-bold text-[#cb212d]"
                        : "text-black"
                    }`}
                  >
                    {item.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Food Items */}
      <div className="p-4">
        <h2 className="text-lg mb-4 font-semibold">
          {selectedCategory === null
            ? "All Items"
            : categories.find((item) => item.id === selectedCategory)?.name +
              " Items"}
        </h2>

        {filteredItems.length === 0 ? (
          <div className="text-center py-8">
            <i className="ri-emotion-sad-line text-4xl text-gray-400 mb-2"></i>
            <p className="text-gray-500">No items found in this category</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between bg-[#ede9e9] p-3 rounded-lg 
                           w-full sm:w-[48%] lg:w-[23%] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 relative">
                    <img
                      src={item.image || "/pngegg.png"}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="rounded-md object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-gray-600">₹{item.price}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isItemInCart(item._id) ? (
                    <div className="flex items-center gap-2 bg-white rounded-full px-2 py-1">
                      <button
                        onClick={() => updateQuantity(item._id, -1)}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-[#cb212d] text-white"
                      >
                        -
                      </button>
                      <span className="text-sm font-medium">
                        {getItemQuantity(item._id)}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-[#cb212d] text-white cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-[#cb212d] text-white px-3 py-1 rounded-md font-semibold text-sm cursor-pointer"
                    >
                      ADD
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Footer */}
      {getCartItemsCount() > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer">
            <i className="ri-shopping-cart-line text-2xl text-[#cb212d]"></i>
            <div>
              <p className="font-semibold text-base">
                {getCartItemsCount()} Items in cart
              </p>
              <p className="text-sm text-gray-600">Total ₹{getCartTotal()}</p>
            </div>
          </div>

          <Link
            href="/cart"
            className="bg-[#cb212d] text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium"
          >
            Checkout
            <i className="ri-arrow-right-line"></i>
          </Link>
        </div>
      )}
    </>
  );
};

export default Page;

