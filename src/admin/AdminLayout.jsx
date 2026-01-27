import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  HomeIcon,
  CubeIcon,
  ShoppingCartIcon,
  Cog6ToothIcon,
  Bars3Icon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";

const AdminLayout = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) return setLoading(false);

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profile?.role === "admin") setIsAdmin(true);
      setLoading(false);
    };
    checkAdmin();
  }, []);

  if (loading) return <p className="p-10">Checking admin access…</p>;
  if (!isAdmin) return <Navigate to="/admin/login" />;

  const nav = [
    { name: "Dashboard", to: "/admin", icon: HomeIcon },
    { name: "Products", to: "/admin/products", icon: CubeIcon },
    { name: "Orders", to: "/admin/orders", icon: ShoppingCartIcon },
    { name: "Settings", to: "/admin/settings", icon: Cog6ToothIcon },
  ];

  const breadcrumb =
    location.pathname
      .replace("/admin", "")
      .split("/")
      .filter(Boolean)
      .join(" / ") || "Dashboard";

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* SIDEBAR */}
      <aside
        className={`fixed z-40 inset-y-0 left-0 w-64 bg-black text-white p-6 transform transition-transform
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <h2 className="text-2xl font-bold mb-8">ROKFit Admin</h2>

        <nav className="space-y-2">
          {nav.map(({ name, to, icon: Icon }) => (
            <Link
              key={name}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
              ${
                location.pathname === to
                  ? "bg-orange-500 text-black"
                  : "hover:bg-gray-800"
              }`}
            >
              <Icon className="w-5 h-5" />
              {name}
            </Link>
          ))}
        </nav>

        <button
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = "/";
          }}
          className="mt-10 text-red-400 hover:underline"
        >
          Logout
        </button>
      </aside>

      {/* OVERLAY (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN */}
      <div className="flex-1 md:ml-64">
        {/* TOP BAR */}
        <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden">
              <Bars3Icon className="w-6 h-6" />
            </button>
            <span className="text-sm text-gray-500">
              Dashboard / {breadcrumb}
            </span>
          </div>

          <button onClick={() => setDark(!dark)}>
            {dark ? (
              <SunIcon className="w-6 h-6" />
            ) : (
              <MoonIcon className="w-6 h-6" />
            )}
          </button>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-6 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
