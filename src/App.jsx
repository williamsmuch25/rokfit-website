import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import ProductPage from "./pages/ProductPage";

import AdminLayout from "./admin/AdminLayout";
import AdminProducts from "./admin/AdminProducts";
import AdminSettings from "./admin/AdminSettings";
import AdminOrders from "./admin/AdminOrders";
import AdminDashboard from "./admin/AdminDashboard";
import AdminLogin from "./admin/AdminLogin";

import WhatsAppFloat from "./components/WhatsAppFloat";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <WhatsAppFloat />

        <Routes>
          {/* 🌍 PUBLIC PAGES */}
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
          <Route path="/product/:slug" element={<ProductPage />} />

          {/* 🔐 ADMIN LOGIN */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* 🔒 ADMIN (PROTECTED) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
