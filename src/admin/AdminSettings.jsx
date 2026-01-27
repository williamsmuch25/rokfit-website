import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*");
    setProducts(data || []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async () => {
    await supabase.from("products").insert({
      name,
      price,
      image,
      stock: 100,
    });

    setName("");
    setPrice("");
    setImage("");
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      {/* Add Product */}
      <div className="bg-white p-6 rounded-xl shadow mb-10">
        <h2 className="font-bold mb-4">Add Product</h2>

        <input
          className="border p-3 w-full mb-3"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border p-3 w-full mb-3"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          className="border p-3 w-full mb-3"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <button
          onClick={addProduct}
          className="bg-black text-white px-6 py-3 rounded"
        >
          Add Product
        </button>
      </div>

      {/* Product List */}
      <div className="space-y-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white p-4 rounded shadow flex justify-between"
          >
            <div>
              <p className="font-bold">{p.name}</p>
              <p>₦{p.price}</p>
            </div>

            <button
              onClick={() => deleteProduct(p.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
