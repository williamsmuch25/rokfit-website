import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";

const Cart = () => {
  const { cart, addToCart, decreaseQty, removeFromCart } = useCart();

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/" className="bg-black text-white px-6 py-3 rounded">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="space-y-6">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 bg-white p-4 rounded-xl shadow"
          >
            <img src={item.image} className="w-24 h-24 object-cover rounded" />

            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-gray-600">₦{item.price.toLocaleString()}</p>

              <div className="flex items-center gap-3 mt-2">
                <button onClick={() => decreaseQty(item.id)}>
                  <FaMinus />
                </button>
                <span>{item.qty}</span>
                <button onClick={() => addToCart(item)}>
                  <FaPlus />
                </button>
              </div>
            </div>

            <button onClick={() => removeFromCart(item.id)}>
              <FaTrash className="text-red-500" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-between items-center">
        <p className="text-xl font-bold">Total: ₦{total.toLocaleString()}</p>

        <Link to="/checkout" className="bg-black text-white px-8 py-3 rounded">
          Checkout
        </Link>
      </div>
    </div>
  );
};

export default Cart;
