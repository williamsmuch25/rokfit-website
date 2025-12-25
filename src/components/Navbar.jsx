import React from "react";
import imagY from "../assets/logo-transparent.png";

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-black">
      <div className="px-6 py-4">
        <div className="flex items-center gap-4">
          <img src={imagY} alt="ROKFit Logo" className="h-16 w-auto" />
          <span className="text-3xl font-bold tracking-wide">
            <span className="text-black">ROK</span>
            <span className="text-orange-500">Fit</span>
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
