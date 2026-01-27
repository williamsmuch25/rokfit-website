import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const nigeriaStates = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
  "FCT (Abuja)",
];

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [deliveryType, setDeliveryType] = useState("standard");
  const [processing, setProcessing] = useState(false);

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const deliveryFee =
    deliveryType === "express"
      ? 5000
      : state === "Lagos"
        ? 1500
        : state
          ? 2000
          : 0;

  const total = subtotal + deliveryFee;

  /* ✅ PAYSTACK SUCCESS → WHATSAPP ORDER */

  const handlePaymentSuccess = (response) => {
    sessionStorage.setItem(
      "rokfit_order",
      JSON.stringify({
        reference: response.reference,
        fullName,
        phone,
        address,
        state,
        deliveryType,
        subtotal,
        deliveryFee,
        total,
        cart,
      }),
    );
    clearCart();
    navigate("/success");
  };

  const validateStockBeforeCheckout = async () => {
    for (const item of cart) {
      const { data, error } = await supabase
        .from("products")
        .select("color_stock")
        .eq("id", item.id)
        .single();

      if (error || !data?.color_stock) {
        alert("A product is no longer available.");
        return false;
      }

      const liveStock = data.color_stock[item.color] ?? 0;

      if (liveStock < item.qty) {
        alert(`Sorry, only ${liveStock} ${item.color} left for ${item.name}.`);
        return false;
      }
    }

    return true;
  };

  const payNow = async () => {
    if (processing) return;

    if (!window.PaystackPop) {
      alert("Paystack not loaded. Refresh the page.");
      return;
    }

    setProcessing(true);

    const ok = await validateStockBeforeCheckout();
    if (!ok) {
      setProcessing(false);
      return;
    }

    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email: phone ? `${phone}@rokfit.fit` : "customer@rokfit.fit",
      amount: total * 100,
      currency: "NGN",
      reference: `ROKFIT_${Date.now()}`,
      metadata: {
        cart: cart.map((item) => ({
          id: item.id,
          color: item.color,
          qty: item.qty,
        })),
      },
      callback: handlePaymentSuccess,
      onClose: () => setProcessing(false),
    });

    handler.openIframe();
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/" className="bg-black text-white px-6 py-3 rounded">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 pb-32">
      <h1 className="text-3xl font-bold mb-2">Secure Checkout</h1>
      <p className="text-sm text-gray-500 mb-8">
        🔒 Secure Paystack checkout • Instant confirmation
      </p>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <input
            className="w-full border p-3 rounded"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            className="w-full border p-3 rounded"
            placeholder="Phone (WhatsApp)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <textarea
            className="w-full border p-3 rounded"
            placeholder="Delivery address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <select
            className="w-full border p-3 rounded"
            value={state}
            onChange={(e) => setState(e.target.value)}
          >
            <option value="">Select State</option>
            {nigeriaStates.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <div className="border rounded p-4 space-y-2">
            <label className="flex gap-2">
              <input
                type="radio"
                checked={deliveryType === "standard"}
                onChange={() => setDeliveryType("standard")}
              />
              Jumia Pickup — 2–4 days (Lagos), 5–7 days (other states)
            </label>
            <label className="flex gap-2">
              <input
                type="radio"
                checked={deliveryType === "express"}
                onChange={() => setDeliveryType("express")}
              />
              Same-Day Express (Lagos only)
            </label>
          </div>
        </div>

        <div className="border p-6 rounded-lg">
          <p>Subtotal: ₦{subtotal.toLocaleString()}</p>
          <p>Delivery: ₦{deliveryFee.toLocaleString()}</p>
          <p className="font-bold text-xl mt-4">
            Total: ₦{total.toLocaleString()}
          </p>

          <button
            onClick={payNow}
            disabled={processing || !fullName || !phone || !address || !state}
            className="mt-6 w-full bg-black text-white py-3 rounded disabled:opacity-50"
          >
            {processing ? "Processing..." : "Pay Securely"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
