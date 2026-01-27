import { useEffect, useState } from "react";

const Success = () => {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("rokfit_order");
    if (saved) {
      setOrder(JSON.parse(saved));
    }
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Order not found.</p>
      </div>
    );
  }

  const itemsText = order.cart
    .map((item, i) => {
      const name = item.name || `Product ${i + 1}`;
      const color = item.color ? ` (${item.color})` : "";
      return `• ${name}${color} × ${item.qty}`;
    })
    .join("\n");

  const message = `
🛒 *NEW ROKFIT ORDER*

🧾 Ref: ${order.reference}

👤 Name: ${order.fullName}
📞 Phone: ${order.phone}
📍 Address: ${order.address}
🏙 State: ${order.state}

🚚 Delivery:
${
  order.deliveryType === "express"
    ? "Same-Day Express (Lagos only)"
    : "Jumia Pickup — 2–4 days (Lagos), 5–7 days (other states)"
}

📦 Items:
${itemsText}

💰 Subtotal: ₦${order.subtotal.toLocaleString()}
🚚 Delivery Fee: ₦${order.deliveryFee.toLocaleString()}
💵 *Total Paid: ₦${order.total.toLocaleString()}*
  `.trim();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-3xl font-bold mb-4">Payment Successful 🎉</h1>
      <p className="mb-6">
        Click below to send your order for confirmation on WhatsApp.
      </p>

      <a
        href={`https://wa.me/2347089472543?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-600 text-white px-6 py-3 rounded"
      >
        Send Order to WhatsApp
      </a>
    </div>
  );
};

export default Success;
