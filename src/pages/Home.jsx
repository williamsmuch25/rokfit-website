import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";

const CATEGORIES = [
  { label: "All", value: "all" },
  { label: "Gym Bags", value: "bags" },
  { label: "Grips", value: "grips" },
  { label: "Bottles", value: "bottles" },
  { label: "Accessories", value: "accessories" },
];

const PAGE_SIZE = 8;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchProducts(true);
  }, [category]);

  const fetchProducts = async (reset = false) => {
    setLoading(true);

    const from = reset ? 0 : (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from("products")
      .select("*", { count: "exact" })
      .eq("active", true)
      .not("color_stock", "is", null)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (category !== "all") {
      query = query.eq("category", category);
    }

    const { data, count } = await query;

    if (reset) {
      setProducts(data || []);
      setPage(2);
    } else {
      setProducts((prev) => [...prev, ...(data || [])]);
      setPage((p) => p + 1);
    }

    setHasMore(products.length + (data?.length || 0) < count);
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <Hero />

      {/* 🔥 COLLECTION TABS */}
      {/* 🔥 COLLECTION TABS */}
      <section id="collections" className="bg-white py-10 border-b">
        <div className="max-w-6xl mx-auto px-6 flex gap-4 overflow-x-auto">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => {
                setCategory(c.value);
                setPage(1);
              }}
              className={`px-6 py-2 rounded-full border text-sm font-semibold whitespace-nowrap transition ${
                category === c.value
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* 🛒 PRODUCTS */}
      <section className="px-6 py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          {loading && products.length === 0 && (
            <p className="text-center text-gray-500 mb-8">Loading products…</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* LOAD MORE */}
          {hasMore && !loading && (
            <div className="flex justify-center mt-12">
              <button
                onClick={() => fetchProducts(false)}
                className="px-8 py-3 bg-black text-white rounded-full hover:bg-orange-500 transition"
              >
                Load More
              </button>
            </div>
          )}

          {!hasMore && products.length > 0 && (
            <p className="text-center text-gray-500 mt-12">
              You’ve reached the end.
            </p>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;
