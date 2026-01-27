import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { FaShoppingCart } from "react-icons/fa";
import CartDrawer from "./CartDrawer";
import logo from "../assets/logo-transparent.png";

const Navbar = () => {
  const { cart } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [animate, setAnimate] = useState(false);

  // 🔥 Shadow on scroll
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 🔔 Cart bounce animation
  useEffect(() => {
    if (cart.length === 0) return;

    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 300);
    return () => clearTimeout(timer);
  }, [cart.length]);

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-lg" : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between animate-navbar">
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="ROKFit" className="h-12 w-auto" />
            <span className="text-2xl font-extrabold tracking-tight">
              <span className="text-black">ROK</span>
              <span className="text-orange-500">Fit</span>
            </span>
          </div>

          {/* CART */}
          <div
            className={`relative cursor-pointer transition ${
              animate ? "animate-bounce" : ""
            }`}
            onClick={() => setOpen(true)}
          >
            <FaShoppingCart size={22} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            )}
          </div>
        </div>
      </nav>

      {/* CART DRAWER */}
      <CartDrawer isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default Navbar;
