import { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const colors = product.color_stock ? Object.keys(product.color_stock) : [];

  const sizes = product.size_stock ? Object.keys(product.size_stock) : [];

  const [selectedColor, setSelectedColor] = useState(colors[0] || null);
  const [selectedSize, setSelectedSize] = useState(sizes[0] || null);

  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0],
      color: selectedColor,
      size: selectedSize,
      qty: 1,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  };

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden flex flex-col">
      {/* IMAGE */}
      <Link to={`/product/${product.slug}`}>
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="h-64 w-full object-cover hover:scale-105 transition"
        />
      </Link>

      {/* INFO */}
      <div className="p-4 flex flex-col flex-grow">
        <Link
          to={`/product/${product.slug}`}
          className="text-lg font-semibold hover:underline"
        >
          {product.name}
        </Link>

        <p className="text-gray-600 mt-2">₦{product.price.toLocaleString()}</p>

        {/* COLORS (TEXT) */}
        {colors.length > 0 && (
          <div className="mt-2">
            <p className="text-xs font-medium mb-1">Color</p>
            <div className="flex gap-2 flex-wrap">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-3 py-1 text-xs border rounded capitalize
                    ${
                      selectedColor === color
                        ? "bg-black text-white"
                        : "bg-white"
                    }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SIZES */}
        {sizes.length > 0 && (
          <div className="mt-2">
            <p className="text-xs font-medium mb-1">Size</p>
            <div className="flex gap-2 flex-wrap">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 text-xs border rounded uppercase
                    ${
                      selectedSize === size ? "bg-black text-white" : "bg-white"
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ADD TO CART */}
        <button
          onClick={handleAdd}
          disabled={!selectedColor || (sizes.length > 0 && !selectedSize)}
          className={`mt-auto px-4 py-3 rounded-lg font-semibold transition ${
            added
              ? "bg-green-600 text-white"
              : "bg-black text-white hover:bg-orange-500"
          }`}
        >
          {added ? "Added ✓" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
