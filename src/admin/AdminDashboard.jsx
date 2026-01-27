import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    todayOrders: 0,
    todaySales: 0,
  });

  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);

    // 🔹 Fetch all orders
    const { data: orders, error } = await supabase
      .from("orders")
      .select("total, created_at");

    if (error) {
      console.error(error);
      alert("Failed to load dashboard");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    let totalSales = 0;
    let todaySales = 0;
    let todayOrders = 0;

    orders.forEach((order) => {
      totalSales += order.total;

      if (order.created_at.startsWith(today)) {
        todaySales += order.total;
        todayOrders += 1;
      }
    });

    // 🔹 Low stock products
    const { data: lowStockProducts } = await supabase
      .from("products")
      .select("id, name, stock")
      .lt("stock", 5)
      .eq("active", true);

    setStats({
      totalSales,
      totalOrders: orders.length,
      todayOrders,
      todaySales,
    });

    setLowStock(lowStockProducts || []);
    setLoading(false);
  };

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Sales"
          value={`₦${stats.totalSales.toLocaleString()}`}
        />
        <StatCard title="Total Orders" value={stats.totalOrders} />
        <StatCard title="Today's Orders" value={stats.todayOrders} />
        <StatCard
          title="Today's Sales"
          value={`₦${stats.todaySales.toLocaleString()}`}
        />
      </div>

      {/* LOW STOCK */}
      <div className="bg-white rounded-xl p-6 shadow">
        <h2 className="text-xl font-bold mb-4">Low Stock Products</h2>

        {lowStock.length === 0 && (
          <p className="text-gray-500">All products have sufficient stock.</p>
        )}

        <ul className="space-y-2">
          {lowStock.map((p) => (
            <li key={p.id} className="flex justify-between border-b pb-2">
              <span>{p.name}</span>
              <span className="text-red-600 font-bold">{p.stock} left</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-xl shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </div>
);

export default AdminDashboard;
