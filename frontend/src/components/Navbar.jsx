import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  ShoppingCart,
  Utensils,
  LogOut,
  LayoutDashboard
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-orange-600"
        >
          <Utensils size={28} />
          TastyBite
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="hidden text-gray-700 hover:text-orange-600 sm:block"
          >
            Menu
          </Link>

          {user?.role === "Customer" && (
            <>
              <Link
                to="/orders"
                className="hidden text-gray-700 hover:text-orange-600 sm:block"
              >
                My Orders
              </Link>

              <Link
                to="/cart"
                className="relative"
              >
                <ShoppingCart size={25} />

                {itemCount > 0 && (
                  <span className="absolute -right-2 -top-2 rounded-full bg-orange-600 px-2 py-0.5 text-xs text-white">
                    {itemCount}
                  </span>
                )}
              </Link>
            </>
          )}

          {user?.role === "Owner" && (
            <Link
              to="/owner"
              className="flex items-center gap-1 text-orange-600"
            >
              <LayoutDashboard size={20} />
              Dashboard
            </Link>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 rounded-lg bg-gray-900 px-3 py-2 text-white"
            >
              <LogOut size={17} />
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-lg bg-orange-600 px-4 py-2 text-white"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;