import React from "react";
import { FaWhatsapp, FaInstagram, FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* CTA */}
        <div className="flex justify-center mb-8">
          <a
            href="https://www.jumia.com.ng/rokfit/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#f68b1e] text-black font-bold px-8 py-3 rounded-full hover:opacity-90 transition"
          >
            Order on Jumia
          </a>
        </div>

        {/* Social Media */}
        <div className="flex justify-center gap-8 mb-8 text-2xl">
          {/* WhatsApp */}
          <a
            href="https://wa.me/2347089472543?text=Hello%20ROKFit%2C%20I%20found%20your%20website%20and%20I%27m%20interested%20in%20your%20gym%20products."
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-400 transition"
          >
            <FaWhatsapp />
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/rokfit2"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-400 transition"
          >
            <FaInstagram />
          </a>

          {/* TikTok */}
          <a
            href="https://www.tiktok.com/@rokfit001"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition"
          >
            <FaTiktok />
          </a>
        </div>

        {/* Legal Links */}
        <div className="flex justify-center gap-6 mb-6 text-sm text-gray-400">
          <a href="/privacy" className="hover:text-white transition">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-white transition">
            Terms & Conditions
          </a>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mb-6"></div>

        {/* Copyright */}
        <p className="text-center text-sm text-gray-400">
          © 2025 <span className="font-semibold text-white">ROKFit</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
