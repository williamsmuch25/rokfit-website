import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Shop() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("active", true);

      setProducts(data);
    };

    fetchProducts();
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((p) => (
        <div key={p.id} className="border p-4">
          <h3 className="font-bold">{p.name}</h3>
          <p>₦{p.price}</p>
          <button className="mt-2 bg-black text-white px-4 py-2">
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}
