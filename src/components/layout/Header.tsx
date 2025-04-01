
import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User, Search, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log("Searching for:", searchQuery);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-brand-navy">
            ShopWP
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 text-gray-700">
            <Link to="/" className="hover:text-brand-navy transition-colors">
              Home
            </Link>
            <Link to="/shop" className="hover:text-brand-navy transition-colors">
              Shop
            </Link>
            <Link to="/categories" className="hover:text-brand-navy transition-colors">
              Categories
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              className="p-2 hover:text-brand-navy transition-colors"
              onClick={toggleSearch}
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            <Link to="/cart" className="p-2 hover:text-brand-navy transition-colors relative">
              <ShoppingCart size={20} />
              {cart && cart.item_count > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-coral text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.item_count}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative group">
                <button className="p-2 hover:text-brand-navy transition-colors" aria-label="User account">
                  <User size={20} />
                </button>
                <div className="hidden group-hover:block absolute right-0 w-48 py-2 mt-2 bg-white rounded-md shadow-lg z-50">
                  <div className="px-4 py-2 text-sm text-gray-700">
                    Hello, {user?.first_name || user?.username}
                  </div>
                  <Link to="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    My Account
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    My Orders
                  </Link>
                  <button 
                    onClick={logout} 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/auth" className="p-2 hover:text-brand-navy transition-colors">
                <User size={20} />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden space-x-4">
            <Link to="/cart" className="p-2 hover:text-brand-navy transition-colors relative">
              <ShoppingCart size={20} />
              {cart && cart.item_count > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-coral text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.item_count}
                </span>
              )}
            </Link>
            
            <button 
              className="p-2 hover:text-brand-navy transition-colors"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Overlay */}
        {isSearchOpen && (
          <div className="absolute inset-x-0 top-16 bg-white shadow-lg z-50">
            <div className="container mx-auto p-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-3 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-navy"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-3 text-gray-400 hover:text-brand-navy"
                  aria-label="Submit search"
                >
                  <Search size={20} />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <nav className="container mx-auto px-4 py-3">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="block py-2 px-4 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/shop" 
                className="block py-2 px-4 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link 
                to="/categories" 
                className="block py-2 px-4 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <button 
                className="flex items-center py-2 px-4 hover:bg-gray-100 rounded-md text-left"
                onClick={toggleSearch}
              >
                <Search size={18} className="mr-2" />
                Search
              </button>
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/account" 
                    className="flex items-center py-2 px-4 hover:bg-gray-100 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={18} className="mr-2" />
                    My Account
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }} 
                    className="flex items-center py-2 px-4 hover:bg-gray-100 rounded-md text-left text-red-600"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link 
                  to="/auth" 
                  className="flex items-center py-2 px-4 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={18} className="mr-2" />
                  Sign in
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
