import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const MAX_IMAGES = 5;

const buildColorStock = (input) => {
  if (!input) return {};
  return input.split(",").reduce((acc, pair) => {
    const [color, qty] = pair.split(":");
    if (!color || !qty) return acc;
    acc[color.trim().toLowerCase()] = Number(qty);
    return acc;
  }, {});
};

const buildStockMap = (input) => {
  if (!input) return {};
  return input.split(",").reduce((acc, pair) => {
    const [key, qty] = pair.split(":");
    if (!key || !qty) return acc;
    acc[key.trim().toUpperCase()] = Number(qty);
    return acc;
  }, {});
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);

  const [editingProduct, setEditingProduct] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [colors, setColors] = useState("");
  const [category, setCategory] = useState("");
  const [sizes, setSizes] = useState("");

  const [images, setImages] = useState([]); // existing URLs
  const [newImages, setNewImages] = useState([]); // File objects

  const [uploading, setUploading] = useState(false);

  // ==========================
  // FETCH PRODUCTS
  // ==========================
  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    setProducts(data || []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ==========================
  // RESET FORM
  // ==========================
  const resetForm = () => {
    setEditingProduct(null);
    setName("");
    setPrice("");
    setDescription("");
    setColors("");
    setCategory("");
    setImages([]);
    setNewImages([]);
  };

  // ==========================
  // SAVE PRODUCT (ADD / EDIT)
  // ==========================
  const saveProduct = async () => {
    if (!name || !price || !category) {
      alert("Name, price and category are required");
      return;
    }

    setUploading(true);

    try {
      let finalImages = [...images];

      // Upload new images
      for (const file of newImages) {
        const ext = file.name.split(".").pop();
        const filePath = `products/${crypto.randomUUID()}.${ext}`;

        await supabase.storage
          .from("products")
          .upload(filePath, file, { upsert: false });

        const { data } = supabase.storage
          .from("products")
          .getPublicUrl(filePath);

        finalImages.push(data.publicUrl);
      }

      finalImages = finalImages.slice(0, MAX_IMAGES);

      const payload = {
        name,
        price: Number(price),
        description,
        category,
        images: finalImages,
        color_stock: buildColorStock(colors), // ✅ ONLY STOCK FIELD
        size_stock: buildStockMap(sizes),
      };

      if (editingProduct) {
        await supabase
          .from("products")
          .update(payload)
          .eq("id", editingProduct.id);
      } else {
        const slug = `${name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")}-${crypto.randomUUID().slice(0, 6)}`;

        await supabase.from("products").insert({
          ...payload,
          slug,
          active: true,
        });
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to save product");
    } finally {
      setUploading(false);
    }
  };

  // ==========================
  // TOGGLE ACTIVE / INACTIVE
  // ==========================
  const toggleActive = async (product) => {
    await supabase
      .from("products")
      .update({ active: !product.active })
      .eq("id", product.id);

    fetchProducts();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      {/* ================= ADD / EDIT FORM ================= */}
      <div className="bg-white p-6 rounded-xl shadow mb-10 space-y-4">
        <h2 className="font-semibold text-lg">
          {editingProduct ? "Edit Product" : "Add Product"}
        </h2>

        <input
          className="border p-3 w-full"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          className="border p-3 w-full"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          className="border p-3 w-full"
          placeholder="S:10, M:20, L:5 (optional)"
          value={sizes}
          onChange={(e) => setSizes(e.target.value)}
        />

        <textarea
          className="border p-3 w-full"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="border p-3 w-full"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="bags">Gym Bags</option>
          <option value="grips">Gym Grips</option>
          <option value="bottles">Bottles</option>
          <option value="accessories">Accessories</option>
        </select>

        <input
          className="border p-3 w-full"
          placeholder="black:30, red:20, grey:50"
          value={colors}
          onChange={(e) => setColors(e.target.value)}
        />

        {/* EXISTING IMAGES */}
        {images.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {images.map((img, i) => (
              <div key={i} className="relative">
                <img
                  src={img}
                  className="w-16 h-16 object-cover rounded"
                  alt=""
                />
                <button
                  onClick={() =>
                    setImages((prev) => prev.filter((_, idx) => idx !== i))
                  }
                  className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 rounded-full"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* NEW IMAGES */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) =>
            setNewImages(Array.from(e.target.files).slice(0, MAX_IMAGES))
          }
        />

        <p className="text-xs text-gray-500">
          Hold <b>Ctrl</b> (Windows) or <b>⌘ Command</b> (Mac) to select
          multiple images (max {MAX_IMAGES})
        </p>

        {newImages.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {newImages.map((file, i) => (
              <img
                key={i}
                src={URL.createObjectURL(file)}
                className="w-16 h-16 object-cover rounded"
                alt=""
              />
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={saveProduct}
            disabled={uploading}
            className="bg-black text-white px-6 py-3 rounded disabled:opacity-50"
          >
            {uploading
              ? "Saving..."
              : editingProduct
                ? "Update Product"
                : "Add Product"}
          </button>

          {editingProduct && (
            <button onClick={resetForm} className="px-6 py-3 border rounded">
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* ================= PRODUCT LIST ================= */}
      <div className="grid md:grid-cols-2 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className={`bg-white p-4 rounded shadow ${
              !p.active ? "opacity-50" : ""
            }`}
          >
            <p className="font-bold">{p.name}</p>
            <p>₦{p.price}</p>

            <p className="text-sm mt-1">
              Status:{" "}
              <span
                className={`font-semibold ${
                  p.active ? "text-green-600" : "text-red-600"
                }`}
              >
                {p.active ? "Active" : "Inactive"}
              </span>
            </p>

            <div className="flex gap-2 mt-2 flex-wrap">
              {p.images?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className="w-16 h-16 object-cover rounded"
                  alt=""
                />
              ))}
            </div>

            <div className="flex gap-4 mt-4 text-sm">
              <button
                onClick={() => {
                  setEditingProduct(p);
                  setName(p.name);
                  setPrice(p.price);
                  setColors(
                    p.color_stock
                      ? Object.entries(p.color_stock)
                          .map(([c, q]) => `${c}:${q}`)
                          .join(", ")
                      : "",
                  );
                  setDescription(p.description || "");
                  setSizes(
                    p.size_stock
                      ? Object.entries(p.size_stock)
                          .map(([s, q]) => `${s}:${q}`)
                          .join(", ")
                      : "",
                  );
                  setCategory(p.category);

                  setImages(p.images || []);
                  setNewImages([]);
                }}
                className="text-blue-600 underline"
              >
                Edit
              </button>

              <button
                onClick={() => toggleActive(p)}
                className="text-orange-600 underline"
              >
                {p.active ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
