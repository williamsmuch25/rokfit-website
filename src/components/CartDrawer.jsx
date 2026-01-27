import React, { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { FaTimes, FaPlus, FaMinus } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, addToCart, decreaseQty, removeFromCart } = useCart();
  const location = useLocation();

  useEffect(() => {
    onClose();
  }, [location.pathname]);

  if (!isOpen) return null;

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <>
      {/* ✅ OVERLAY (transparent, BELOW drawer) */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* ✅ DRAWER */}
      <div className="fixed right-0 top-0 h-full w-80 bg-white z-50 shadow-xl p-5 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <button onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {cart.length === 0 && (
            <p className="text-gray-500 text-center mt-10">
              Your cart is empty
            </p>
          )}

          {cart.map((item) => (
            <div
              key={`${item.id}-${item.color}-${item.size}`} // ✅ IMPORTANT
              className="flex gap-3 border-b pb-3"
            >
              <img
                src={item.image || item.images?.[0]}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />

              <div className="flex-1">
                <h4 className="font-semibold">{item.name}</h4>

                {/* ✅ COLOR DISPLAY */}
                <p className="text-xs text-gray-500 capitalize">
                  Color: {item.color}
                </p>

                {item.size && (
                  <p className="text-xs text-gray-500 uppercase">
                    Size: {item.size}
                  </p>
                )}

                <p className="text-sm text-gray-600">
                  ₦{item.price.toLocaleString()}
                </p>

                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => decreaseQty(item.id, item.color, item.size)}
                  >
                    <FaMinus size={10} />
                  </button>

                  <span className="text-sm font-medium">{item.qty}</span>

                  <button
                    onClick={() => addToCart(item)}
                    className="p-1 border rounded"
                  >
                    <FaPlus size={10} />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.id, item.color, item.size)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t pt-4">
            <p className="font-bold mb-3">Total: ₦{total.toLocaleString()}</p>

            <Link
              to="/checkout"
              className="block w-full bg-black text-white text-center py-3 rounded"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
