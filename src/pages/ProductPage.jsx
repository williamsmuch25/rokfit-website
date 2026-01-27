import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useCart } from "../context/CartContext";

const COLOR_MAP = {
  black: "#000000",
  white: "#ffffff",
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#22c55e",
  grey: "#9ca3af",
  gray: "#9ca3af",
  gold: "#facc15",
  navy: "#1e3a8a",
  pink: "#ec4899",
};

const ProductPage = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [availableStock, setAvailableStock] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (data) {
        setProduct(data);
        setSelectedImage(data.images?.[0] || "");

        if (data.color_stock && Object.keys(data.color_stock).length > 0) {
          const firstColor = Object.keys(data.color_stock)[0];
          setSelectedColor(firstColor);
          setAvailableStock(Number(data.color_stock[firstColor]) || 0);
        } else {
          setAvailableStock(0);
        }
      }

      setLoading(false);
    };

    fetchProduct();
  }, [slug]);

  if (loading) return <p className="p-10">Loading...</p>;
  if (!product) return <p className="p-10">Product not found</p>;

  const handleAdd = () => {
    if (availableStock === 0 || added) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: selectedImage,
      color: selectedColor,
      size: selectedSize,
      qty,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 800);
  };

  return (
    <div className="bg-gray-100 text-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-12 pb-32 grid md:grid-cols-2 gap-12">
        {/* IMAGE */}
        <div>
          <img
            src={selectedImage}
            alt={product.name}
            className="w-full h-[400px] object-cover rounded-xl mb-4"
          />

          <div className="flex gap-3">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-20 object-cover rounded cursor-pointer border ${
                  selectedImage === img ? "border-black" : "border-gray-300"
                }`}
                alt=""
              />
            ))}
          </div>
        </div>

        {/* INFO */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-xl font-semibold mb-4">
            ₦{product.price.toLocaleString()}
          </p>

          {/* COLORS */}

          {product.color_stock && (
            <div className="mb-6">
              <p className="font-medium mb-2">Color</p>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(product.color_stock).map(([color, stock]) => (
                  <button
                    key={color}
                    disabled={stock === 0}
                    onClick={() => {
                      setSelectedColor(color);
                      setAvailableStock(stock);
                      setQty(1);
                    }}
                    className={`px-4 py-2 border rounded capitalize
            ${selectedColor === color ? "bg-black text-white" : "bg-white"}
            ${stock === 0 ? "opacity-40 cursor-not-allowed" : ""}
          `}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.size_stock && (
            <div className="mb-6">
              <p className="font-medium mb-2">Size</p>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(product.size_stock).map(([size, stock]) => (
                  <button
                    key={size}
                    disabled={stock === 0}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded text-sm
            ${selectedSize === size ? "border-black font-semibold" : "border-gray-300"}
            ${stock === 0 ? "opacity-40 cursor-not-allowed" : ""}
          `}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* QUANTITY */}
          <div className="mb-6">
            <p className="font-medium mb-2">Quantity</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-1 border rounded"
              >
                -
              </button>
              <span>{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(availableStock, q + 1))}
                className="px-3 py-1 border rounded"
              >
                +
              </button>
            </div>
          </div>

          {/* STOCK INFO */}
          <p className="text-sm text-gray-500 mb-4">
            {availableStock === 0
              ? "Out of stock"
              : availableStock <= 5
                ? `Only ${availableStock} left`
                : `${availableStock} available`}
          </p>

          {/* ADD TO CART */}
          <button
            onClick={handleAdd}
            disabled={
              !selectedColor ||
              (product.size_stock &&
                Object.keys(product.size_stock).length > 0 &&
                !selectedSize)
            }
            className={`w-full py-4 rounded-lg font-semibold transition ${
              added
                ? "bg-green-600 text-white"
                : "bg-black text-white hover:bg-orange-500"
            }`}
          >
            {added ? "Added ✓" : "Add to Cart"}
          </button>

          {/* DESCRIPTION */}
          {product.description && (
            <div className="mt-8">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
