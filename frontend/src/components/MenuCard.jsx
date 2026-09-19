import { Leaf, Drumstick, Plus } from "lucide-react";

import { useCart } from "../context/CartContext";

const MenuCard = ({ item }) => {
  const { addToCart } = useCart();

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl">
      <img
        src={item.image}
        alt={item.name}
        className="h-52 w-full object-cover"
      />

      <div className="p-5">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">
            {item.name}
          </h3>

          {item.isVeg ? (
            <Leaf
              size={20}
              className="text-green-600"
            />
          ) : (
            <Drumstick
              size={20}
              className="text-red-600"
            />
          )}
        </div>

        <p className="mb-4 min-h-12 text-sm text-gray-500">
          {item.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-orange-600">
            ₹{item.price}
          </span>

          <button
            onClick={() => addToCart(item)}
            disabled={!item.isAvailable}
            className="flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 font-semibold text-white hover:bg-orange-700 disabled:bg-gray-400"
          >
            <Plus size={18} />

            {item.isAvailable
              ? "Add"
              : "Unavailable"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;