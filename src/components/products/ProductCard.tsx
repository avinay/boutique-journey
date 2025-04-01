
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, loading } = useCart();
  const imageUrl = product.images[0]?.src || "https://via.placeholder.com/300";
  
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product.id, 1);
  };
  
  const isOnSale = product.sale_price && product.regular_price !== product.sale_price;

  return (
    <div className="group card-hover bg-white rounded-lg overflow-hidden shadow">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative">
          <div className="aspect-square overflow-hidden">
            <img 
              src={imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
          
          {/* Sale Badge */}
          {isOnSale && (
            <span className="absolute top-2 left-2 bg-brand-coral text-white text-sm px-2 py-1 rounded">
              Sale
            </span>
          )}
          
          {/* Stock Status */}
          {product.stock_status === "outofstock" && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-gray-800 px-3 py-1 rounded-sm font-medium">
                Out of Stock
              </span>
            </div>
          )}
          
          {/* Quick Add Button */}
          {product.stock_status !== "outofstock" && (
            <button
              onClick={handleAddToCart}
              disabled={loading}
              className="absolute bottom-4 right-4 bg-white text-brand-navy p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Add to cart"
            >
              <ShoppingCart size={18} />
            </button>
          )}
        </div>
        
        <div className="p-4">
          {/* Category */}
          {product.categories && product.categories.length > 0 && (
            <div className="text-xs text-gray-500 mb-1">
              {product.categories[0].name}
            </div>
          )}
          
          {/* Product Name */}
          <h3 className="font-medium text-gray-800 mb-1 line-clamp-2">
            {product.name}
          </h3>
          
          {/* Price */}
          <div className="mt-2 flex items-center">
            {isOnSale ? (
              <>
                <span className="font-semibold text-brand-coral mr-2">
                  ${product.sale_price}
                </span>
                <span className="text-gray-500 line-through text-sm">
                  ${product.regular_price}
                </span>
              </>
            ) : (
              <span className="font-semibold text-gray-900">
                ${product.price}
              </span>
            )}
          </div>
          
          {/* Rating */}
          {product.average_rating && Number(product.average_rating) > 0 && (
            <div className="flex items-center mt-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${
                      Number(product.average_rating) >= star
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
