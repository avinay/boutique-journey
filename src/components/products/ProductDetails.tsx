
import { useState } from "react";
import { ShoppingCart, Heart, Share2, Check, X } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

interface ProductDetailsProps {
  product: Product;
  loading?: boolean;
}

const ProductDetails = ({ product, loading = false }: ProductDetailsProps) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  
  const isOnSale = product?.sale_price && product?.regular_price !== product?.sale_price;
  const inStock = product?.stock_status === "instock";

  // Handle adding the product to cart
  const handleAddToCart = async () => {
    if (!product) return;
    
    await addToCart(product.id, quantity);
  };

  // Handle quantity change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  // Handle increment/decrement
  const adjustQuantity = (amount: number) => {
    const newValue = quantity + amount;
    if (newValue > 0) {
      setQuantity(newValue);
    }
  };

  // Handle attribute selection
  const handleAttributeChange = (attributeName: string, value: string) => {
    setSelectedAttributes(prev => ({
      ...prev,
      [attributeName]: value
    }));
  };

  // Handle wishlist
  const handleAddToWishlist = () => {
    toast.success("Added to wishlist");
  };

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.short_description,
        url: window.location.href,
      }).catch((error) => {
        console.error('Error sharing:', error);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
        <div className="aspect-square bg-gray-200 rounded-lg" />
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-6 bg-gray-200 rounded w-1/2" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
          <div className="h-12 bg-gray-200 rounded w-1/3" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Product Images */}
      <div className="space-y-4">
        <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[selectedImage].src}
              alt={product.images[selectedImage].alt || product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              No image available
            </div>
          )}
        </div>
        
        {/* Thumbnail Gallery */}
        {product.images && product.images.length > 1 && (
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden ${
                  selectedImage === index
                    ? "ring-2 ring-brand-navy"
                    : "border border-gray-200"
                }`}
              >
                <img
                  src={image.src}
                  alt={image.alt || `Product view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-5">
        {/* Categories */}
        {product.categories && product.categories.length > 0 && (
          <div className="text-sm text-gray-500">
            {product.categories.map(cat => cat.name).join(", ")}
          </div>
        )}

        {/* Product Name */}
        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

        {/* Price */}
        <div className="flex items-center">
          {isOnSale ? (
            <>
              <span className="text-2xl font-bold text-brand-coral">
                ${product.sale_price}
              </span>
              <span className="ml-2 text-gray-500 line-through">
                ${product.regular_price}
              </span>
            </>
          ) : (
            <span className="text-2xl font-bold text-gray-900">
              ${product.price}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="flex items-center">
          {inStock ? (
            <div className="flex items-center text-green-600">
              <Check size={16} className="mr-1" />
              <span className="text-sm">In Stock</span>
            </div>
          ) : (
            <div className="flex items-center text-red-600">
              <X size={16} className="mr-1" />
              <span className="text-sm">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Short Description */}
        {product.short_description && (
          <div className="text-gray-700 prose-sm" 
            dangerouslySetInnerHTML={{ __html: product.short_description }}
          />
        )}

        {/* Attributes/Variations */}
        {product.attributes &&
          product.attributes.filter(attr => attr.variation).map(attribute => (
            <div key={attribute.id} className="space-y-2">
              <div className="font-medium text-gray-800">{attribute.name}</div>
              <div className="flex flex-wrap gap-2">
                {attribute.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleAttributeChange(attribute.name, option)}
                    className={`px-3 py-1 border rounded-md text-sm ${
                      selectedAttributes[attribute.name] === option
                        ? "border-brand-navy bg-brand-navy text-white"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}

        {/* Quantity Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <div className="flex border border-gray-300 rounded-md w-32">
            <button
              onClick={() => adjustQuantity(-1)}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
              disabled={quantity <= 1}
            >
              -
            </button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              className="w-full text-center focus:outline-none"
            />
            <button
              onClick={() => adjustQuantity(1)}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
            >
              +
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`btn-primary flex items-center ${
              !inStock ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <ShoppingCart size={18} className="mr-2" />
            Add to Cart
          </button>
          <button
            onClick={handleAddToWishlist}
            className="btn-secondary flex items-center"
          >
            <Heart size={18} className="mr-2" />
            Add to Wishlist
          </button>
          <button
            onClick={handleShare}
            className="btn-secondary flex items-center"
          >
            <Share2 size={18} className="mr-2" />
            Share
          </button>
        </div>
      </div>

      {/* Product Full Description */}
      {product.description && (
        <div className="mt-12 col-span-1 md:col-span-2">
          <h2 className="text-xl font-bold mb-4">Description</h2>
          <div className="prose max-w-none" 
            dangerouslySetInnerHTML={{ __html: product.description }} 
          />
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
