import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          quantity,
          price,
          products (
            name,
            image
          )
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      alert("Failed to load orders");
    } else {
      setOrders(data || []);
    }

    setLoading(false);
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Orders</h1>

      {orders.length === 0 && <p className="text-gray-500">No orders yet.</p>}

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow p-6">
            {/* Order Header */}
            <div className="flex justify-between mb-4">
              <div>
                <p className="font-bold">{order.full_name}</p>
                <p className="text-sm text-gray-600">{order.phone}</p>
                <p className="text-sm text-gray-600">{order.state}</p>
              </div>

              <div className="text-right">
                <p className="font-bold text-green-600">
                  ₦{order.total.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(order.created_at).toLocaleString()}
                </p>
                <p className="text-xs">Ref: {order.payment_ref}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="border-t pt-4 space-y-3">
              {order.order_items.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  {item.products?.image && (
                    <img
                      src={item.products.image}
                      alt={item.products.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}

                  <div className="flex-1">
                    <p className="font-medium">{item.products?.name}</p>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="font-medium">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Status */}
            <div className="mt-4">
              <span className="inline-block px-3 py-1 text-xs rounded bg-gray-200">
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
