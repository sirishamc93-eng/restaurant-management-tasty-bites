import {
  Link,
  useNavigate
} from "react-router-dom";

import { Minus, Plus, Trash2 } from "lucide-react";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

const Cart = () => {
  const {
    cart,
    total,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();

  const placeOrder = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await API.post("/orders", {
        items: cart.map((item) => ({
          menuItemId: item._id,
          quantity: item.quantity
        })),
        paymentMethod: "COD",
      });

      clearCart();

      alert("Order placed successfully!");

      navigate("/orders");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to place order"
      );
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-5 text-6xl">🛒</div>

        <h1 className="text-3xl font-bold">
          Your cart is empty
        </h1>

        <p className="mt-2 text-gray-500">
          Add something delicious from our menu.
        </p>

        <Link
          to="/"
          className="mt-6 rounded-xl bg-orange-600 px-6 py-3 text-white"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-4xl font-black">
          Your Cart
        </h1>

        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow sm:flex-row sm:items-center"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-24 w-full rounded-xl object-cover sm:w-28"
              />

              <div className="flex-1">
                <h2 className="font-bold">
                  {item.name}
                </h2>

                <p className="text-orange-600">
                  ₹{item.price}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    decreaseQuantity(item._id)
                  }
                  className="rounded-lg bg-gray-100 p-2"
                >
                  <Minus size={16} />
                </button>

                <span className="font-bold">
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    increaseQuantity(item._id)
                  }
                  className="rounded-lg bg-gray-100 p-2"
                >
                  <Plus size={16} />
                </button>
              </div>

              <p className="w-24 text-right font-bold">
                ₹{item.price * item.quantity}
              </p>

              <button
                onClick={() =>
                  removeFromCart(item._id)
                }
                className="text-red-500"
              >
                <Trash2 />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow">
          <div className="mb-5 flex justify-between text-2xl font-black">
            <span>Total</span>
            <span className="text-orange-600">
              ₹{total}
            </span>
          </div>

          <button
            onClick={placeOrder}
            className="w-full rounded-xl bg-orange-600 py-4 font-bold text-white hover:bg-orange-700"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;