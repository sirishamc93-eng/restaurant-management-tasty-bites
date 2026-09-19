import {
  useEffect,
  useState
} from "react";

import {
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Search,
  Printer,
  X
} from "lucide-react";

import API from "../services/api";

const statuses = [
  "Pending",
  "Preparing",
  "Ready",
  "Delivered"
];

const OwnerDashboard = () => {
  const [
    orders,
    setOrders
  ] = useState([]);

  const [
    menu,
    setMenu
  ] = useState([]);

  const [
    categories,
    setCategories
  ] = useState([]);

  const [
    activeTab,
    setActiveTab
  ] = useState("orders");

  const [
    editingItem,
    setEditingItem
  ] = useState(null);

  const [
    searchId,
    setSearchId
  ] = useState("");

  const [
    itemForm,
    setItemForm
  ] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: "Starters",
    isVeg: true,
    isAvailable: true
  });

  const [
    categoryName,
    setCategoryName
  ] = useState("");


  const fetchData = async (
    search = ""
  ) => {
    try {
      const orderUrl =
        search.trim()
          ? `/orders?search=${encodeURIComponent(
              search.trim()
            )}`
          : "/orders";

      const [
        ordersResponse,
        menuResponse,
        categoriesResponse
      ] = await Promise.all([
        API.get(orderUrl),
        API.get("/menu"),
        API.get(
          "/menu/categories/all"
        )
      ]);

      setOrders(
        ordersResponse.data
      );

      setMenu(
        menuResponse.data
      );

      setCategories(
        categoriesResponse.data
      );
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);


  const searchOrders = async (
    e
  ) => {
    e.preventDefault();

    if (!searchId.trim()) {
      fetchData();
      return;
    }

    await fetchData(searchId);
  };


  const clearSearch = () => {
    setSearchId("");
    fetchData();
  };


  const changeStatus = async (
    orderId,
    status
  ) => {
    try {
      const response =
        await API.put(
          `/orders/${orderId}/status`,
          {
            status
          }
        );

      setOrders((current) =>
        current.map((order) =>
          order._id === orderId
            ? response.data
            : order
        )
      );
    } catch (error) {
      alert(
        error.response?.data
          ?.message ||
          "Unable to update order"
      );
    }
  };


  const printBill = (order) => {
    const billWindow =
      window.open(
        "",
        "_blank",
        "width=800,height=900"
      );

    if (!billWindow) {
      alert(
        "Please allow popups to print the bill."
      );

      return;
    }

    const itemRows =
      order.items
        .map(
          (item) => `
            <tr>
              <td>${item.menuItemId.name}</td>
              <td>${item.quantity}</td>
              <td>₹${item.menuItemId.price}</td>
              <td>
                ₹${
                  item.menuItemId.price *
                  item.quantity
                }
              </td>
            </tr>
          `
        )
        .join("");

    billWindow.document.write(`
      <!DOCTYPE html>

      <html>

      <head>

        <title>
          TastyBite Bill
        </title>

        <style>

          body {
            font-family: Arial, sans-serif;
            padding: 40px;
          }

          .bill {
            max-width: 700px;
            margin: auto;
          }

          .header {
            text-align: center;
          }

          .header h1 {
            color: #ea580c;
          }

          .details {
            margin: 30px 0;
            line-height: 1.8;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th,
          td {
            padding: 12px;
            border-bottom: 1px solid #ddd;
            text-align: left;
          }

          th {
            background: #f97316;
            color: white;
          }

          .total {
            margin-top: 25px;
            text-align: right;
            font-size: 24px;
            font-weight: bold;
          }

          .payment {
            margin-top: 20px;
            padding: 15px;
            background: #fff7ed;
            border: 1px solid #fed7aa;
          }

          .footer {
            margin-top: 50px;
            text-align: center;
            color: #777;
          }

        </style>

      </head>

      <body>

        <div class="bill">

          <div class="header">

            <h1>TastyBite</h1>

            <p>
              Restaurant Menu & Orders
            </p>

            <h2>INVOICE</h2>

          </div>

          <div class="details">

            <strong>Order ID:</strong>
            #${order._id}

            <br>

            <strong>Customer:</strong>
            ${order.userId?.name || ""}

            <br>

            <strong>Email:</strong>
            ${order.userId?.email || ""}

            <br>

            <strong>Date:</strong>
            ${new Date(
              order.createdAt
            ).toLocaleString()}

            <br>

            <strong>Status:</strong>
            ${order.status}

          </div>

          <table>

            <thead>

              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Amount</th>
              </tr>

            </thead>

            <tbody>

              ${itemRows}

            </tbody>

          </table>

          <div class="total">

            Total:
            ₹${order.totalAmount}

          </div>

          <div class="payment">

            <strong>
              Payment Method:
            </strong>

            Cash on Delivery

            <br>

            <strong>
              Payment Status:
            </strong>

            ${order.paymentStatus}

          </div>

          <div class="footer">

            Thank you for ordering
            from TastyBite!

          </div>

        </div>

        <script>

          window.onload = function() {
            window.print();
          };

        </script>

      </body>

      </html>
    `);

    billWindow.document.close();
  };


  const saveItem = async (
    e
  ) => {
    e.preventDefault();

    try {
      if (editingItem) {
        const response =
          await API.put(
            `/menu/${editingItem._id}`,
            itemForm
          );

        setMenu((current) =>
          current.map((item) =>
            item._id ===
            editingItem._id
              ? response.data
              : item
          )
        );
      } else {
        const response =
          await API.post(
            "/menu",
            itemForm
          );

        setMenu((current) => [
          ...current,
          response.data
        ]);
      }

      setEditingItem(null);

      setItemForm({
        name: "",
        price: "",
        description: "",
        image: "",
        category:
          categories[0]?.name ||
          "Starters",
        isVeg: true,
        isAvailable: true
      });
    } catch (error) {
      alert(
        error.response?.data
          ?.message ||
          "Unable to save item"
      );
    }
  };


  const deleteItem = async (
    id
  ) => {
    if (
      !window.confirm(
        "Delete this menu item?"
      )
    ) {
      return;
    }

    try {
      await API.delete(
        `/menu/${id}`
      );

      setMenu((current) =>
        current.filter(
          (item) =>
            item._id !== id
        )
      );
    } catch (error) {
      alert(
        "Unable to delete item"
      );
    }
  };


  const editItem = (
    item
  ) => {
    setEditingItem(item);

    setItemForm({
      name: item.name,
      price: item.price,
      description:
        item.description,
      image: item.image,
      category:
        item.category,
      isVeg: item.isVeg,
      isAvailable:
        item.isAvailable
    });

    setActiveTab("menu");
  };


  const addCategory = async (
    e
  ) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      return;
    }

    try {
      const response =
        await API.post(
          "/menu/categories",
          {
            name: categoryName
          }
        );

      setCategories(
        (current) => [
          ...current,
          response.data
        ]
      );

      setCategoryName("");
    } catch (error) {
      alert(
        error.response?.data
          ?.message ||
          "Unable to add category"
      );
    }
  };


  const deleteCategory = async (
    id
  ) => {
    if (
      !window.confirm(
        "Delete this category?"
      )
    ) {
      return;
    }

    try {
      await API.delete(
        `/menu/categories/${id}`
      );

      setCategories(
        (current) =>
          current.filter(
            (category) =>
              category._id !== id
          )
      );
    } catch (error) {
      alert(
        "Unable to delete category"
      );
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>

            <h1 className="text-4xl font-black">
              Owner Dashboard
            </h1>

            <p className="text-gray-500">
              Manage orders and
              restaurant menu
            </p>

          </div>

          <button
            onClick={() =>
              fetchData(
                searchId
              )
            }
            className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-white"
          >
            <RefreshCw
              size={18}
            />

            Refresh
          </button>

        </div>


        {/* TABS */}

        <div className="mb-6 flex gap-2 overflow-x-auto">

          {[
            ["orders", "Orders"],
            ["menu", "Menu"],
            [
              "categories",
              "Categories"
            ]
          ].map(
            ([key, label]) => (
              <button
                key={key}
                onClick={() =>
                  setActiveTab(
                    key
                  )
                }
                className={`rounded-xl px-5 py-3 font-bold ${
                  activeTab === key
                    ? "bg-orange-600 text-white"
                    : "bg-white"
                }`}
              >
                {label}
              </button>
            )
          )}

        </div>


        {/* ORDERS */}

        {activeTab ===
          "orders" && (
          <div>

            {/* SEARCH */}

            <form
              onSubmit={
                searchOrders
              }
              className="mb-6 rounded-2xl bg-white p-4 shadow"
            >

              <div className="flex flex-col gap-3 sm:flex-row">

                <div className="relative flex-1">

                  <Search
                    size={20}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    value={searchId}
                    onChange={(e) =>
                      setSearchId(
                        e.target
                          .value
                      )
                    }
                    placeholder="Search by Order ID..."
                    className="w-full rounded-xl border py-3 pl-10 pr-4 outline-none focus:border-orange-500"
                  />

                </div>

                <button
                  type="submit"
                  className="rounded-xl bg-orange-600 px-6 py-3 font-bold text-white"
                >
                  Search
                </button>

                {searchId && (
                  <button
                    type="button"
                    onClick={
                      clearSearch
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-gray-200 px-5 py-3 font-bold"
                  >
                    <X size={18} />
                    Clear
                  </button>
                )}

              </div>

              <p className="mt-2 text-xs text-gray-500">
                Enter the complete MongoDB
                Order ID.
              </p>

            </form>


            <div className="space-y-5">

              {orders.map(
                (order) => (

                  <div
                    key={
                      order._id
                    }
                    className="rounded-2xl bg-white p-6 shadow"
                  >

                    {/* ORDER HEADER */}

                    <div className="flex flex-col justify-between gap-5 lg:flex-row">

                      <div>

                        <p className="text-sm text-gray-500">
                          Order ID
                        </p>

                        <p className="font-black">
                          #{order._id.slice(
                            -8
                          )}
                        </p>

                        <p className="mt-1 break-all text-xs text-gray-400">
                          {order._id}
                        </p>

                        <p className="mt-3">
                          Customer:{" "}
                          <strong>
                            {
                              order
                                .userId
                                ?.name
                            }
                          </strong>
                        </p>

                      </div>


                      <div>

                        <p className="text-sm text-gray-500">
                          Total
                        </p>

                        <p className="text-2xl font-black text-orange-600">
                          ₹
                          {
                            order.totalAmount
                          }
                        </p>

                      </div>


                      <div>

                        <label className="mb-2 block text-sm font-medium">
                          Order Status
                        </label>

                        <select
                          value={
                            order.status
                          }
                          onChange={(
                            e
                          ) =>
                            changeStatus(
                              order._id,
                              e.target
                                .value
                            )
                          }
                          className="rounded-xl border p-3 font-bold"
                        >

                          {statuses.map(
                            (
                              status
                            ) => (
                              <option
                                key={
                                  status
                                }
                                value={
                                  status
                                }
                              >
                                {status}
                              </option>
                            )
                          )}

                        </select>

                      </div>

                    </div>


                    {/* PAYMENT */}

                    <div className="mt-5 flex flex-col gap-3 rounded-xl bg-orange-50 p-4 sm:flex-row sm:items-center sm:justify-between">

                      <div>

                        <p className="text-sm text-gray-500">
                          Payment Method
                        </p>

                        <p className="font-bold">
                          💵 Cash on Delivery
                        </p>

                      </div>

                      <div>

                        <p className="text-sm text-gray-500">
                          Payment Status
                        </p>

                        <p
                          className={
                            order.paymentStatus ===
                            "Paid"
                              ? "font-bold text-green-600"
                              : "font-bold text-orange-600"
                          }
                        >
                          {order.paymentStatus}
                        </p>

                      </div>

                      <button
                        onClick={() =>
                          printBill(
                            order
                          )
                        }
                        className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 font-bold text-white"
                      >
                        <Printer
                          size={18}
                        />

                        Print Bill
                      </button>

                    </div>


                    {/* ITEMS */}

                    <div className="mt-5 border-t pt-5">

                      <h3 className="mb-3 font-bold">
                        Items
                      </h3>

                      {order.items.map(
                        (
                          item
                        ) => (

                          <div
                            key={
                              item
                                .menuItemId
                                ._id
                            }
                            className="flex justify-between py-1 text-sm"
                          >

                            <span>
                              {
                                item
                                  .menuItemId
                                  .name
                              }{" "}
                              ×{" "}
                              {
                                item.quantity
                              }
                            </span>

                            <span>
                              ₹
                              {
                                item
                                  .menuItemId
                                  .price *
                                item.quantity
                              }
                            </span>

                          </div>

                        )
                      )}

                    </div>

                  </div>

                )
              )}


              {orders.length ===
                0 && (

                <div className="rounded-2xl bg-white p-10 text-center shadow">

                  <p className="text-gray-500">
                    {searchId
                      ? "No order found with this ID."
                      : "No orders yet."}
                  </p>

                </div>

              )}

            </div>

          </div>
        )}


        {/* MENU */}

        {activeTab ===
          "menu" && (

          <div className="grid gap-6 lg:grid-cols-3">

            <form
              onSubmit={saveItem}
              className="rounded-2xl bg-white p-6 shadow lg:col-span-1"
            >

              <h2 className="mb-5 text-2xl font-black">
                {editingItem
                  ? "Edit Item"
                  : "Add Item"}
              </h2>

              <input
                placeholder="Name"
                value={
                  itemForm.name
                }
                onChange={(e) =>
                  setItemForm({
                    ...itemForm,
                    name: e.target
                      .value
                  })
                }
                className="mb-3 w-full rounded-xl border p-3"
                required
              />

              <input
                type="number"
                placeholder="Price"
                value={
                  itemForm.price
                }
                onChange={(e) =>
                  setItemForm({
                    ...itemForm,
                    price:
                      e.target.value
                  })
                }
                className="mb-3 w-full rounded-xl border p-3"
                required
              />

              <textarea
                placeholder="Description"
                value={
                  itemForm.description
                }
                onChange={(e) =>
                  setItemForm({
                    ...itemForm,
                    description:
                      e.target.value
                  })
                }
                className="mb-3 w-full rounded-xl border p-3"
                rows="3"
                required
              />

              <input
                placeholder="Image URL"
                value={
                  itemForm.image
                }
                onChange={(e) =>
                  setItemForm({
                    ...itemForm,
                    image:
                      e.target.value
                  })
                }
                className="mb-3 w-full rounded-xl border p-3"
                required
              />

              <select
                value={
                  itemForm.category
                }
                onChange={(e) =>
                  setItemForm({
                    ...itemForm,
                    category:
                      e.target.value
                  })
                }
                className="mb-3 w-full rounded-xl border p-3"
              >

                {categories.map(
                  (
                    category
                  ) => (

                    <option
                      key={
                        category._id
                      }
                      value={
                        category.name
                      }
                    >
                      {
                        category.name
                      }
                    </option>

                  )
                )}

              </select>

              <label className="mb-4 flex gap-2">

                <input
                  type="checkbox"
                  checked={
                    itemForm.isVeg
                  }
                  onChange={(e) =>
                    setItemForm({
                      ...itemForm,
                      isVeg:
                        e.target
                          .checked
                    })
                  }
                />

                Vegetarian

              </label>

              <label className="mb-5 flex gap-2">

                <input
                  type="checkbox"
                  checked={
                    itemForm.isAvailable
                  }
                  onChange={(e) =>
                    setItemForm({
                      ...itemForm,
                      isAvailable:
                        e.target
                          .checked
                    })
                  }
                />

                Available

              </label>

              <button className="w-full rounded-xl bg-orange-600 py-3 font-bold text-white">

                {editingItem
                  ? "Update Item"
                  : "Add Item"}

              </button>

              {editingItem && (

                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(
                      null
                    );

                    setItemForm({
                      name: "",
                      price: "",
                      description:
                        "",
                      image: "",
                      category:
                        categories[0]
                          ?.name ||
                        "Starters",
                      isVeg: true,
                      isAvailable:
                        true
                    });
                  }}
                  className="mt-2 w-full rounded-xl bg-gray-200 py-3 font-bold"
                >
                  Cancel
                </button>

              )}

            </form>


            <div className="space-y-3 lg:col-span-2">

              {menu.map(
                (item) => (

                  <div
                    key={
                      item._id
                    }
                    className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow sm:flex-row sm:items-center"
                  >

                    <img
                      src={
                        item.image
                      }
                      alt={
                        item.name
                      }
                      className="h-24 w-full rounded-xl object-cover sm:w-28"
                    />

                    <div className="flex-1">

                      <h3 className="font-bold">
                        {item.name}
                      </h3>

                      <p className="text-orange-600">
                        ₹
                        {item.price}
                      </p>

                      <p className="text-sm text-gray-500">
                        {
                          item.category
                        }{" "}
                        •{" "}
                        {item.isVeg
                          ? "Veg"
                          : "Non-Veg"}
                      </p>

                    </div>

                    <div className="flex gap-2">

                      <button
                        onClick={() =>
                          editItem(
                            item
                          )
                        }
                        className="rounded-lg bg-blue-100 p-3 text-blue-600"
                      >
                        <Pencil
                          size={
                            18
                          }
                        />
                      </button>

                      <button
                        onClick={() =>
                          deleteItem(
                            item._id
                          )
                        }
                        className="rounded-lg bg-red-100 p-3 text-red-600"
                      >
                        <Trash2
                          size={
                            18
                          }
                        />
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          </div>

        )}


        {/* CATEGORIES */}

        {activeTab ===
          "categories" && (

          <div className="grid gap-6 md:grid-cols-2">

            <form
              onSubmit={
                addCategory
              }
              className="rounded-2xl bg-white p-6 shadow"
            >

              <h2 className="mb-5 text-2xl font-black">
                Add Category
              </h2>

              <input
                value={
                  categoryName
                }
                onChange={(e) =>
                  setCategoryName(
                    e.target
                      .value
                  )
                }
                placeholder="Category name"
                className="mb-4 w-full rounded-xl border p-3"
              />

              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 py-3 font-bold text-white">

                <Plus
                  size={18}
                />

                Add Category

              </button>

            </form>


            <div className="space-y-3">

              {categories.map(
                (category) => (

                  <div
                    key={
                      category._id
                    }
                    className="flex items-center justify-between rounded-xl bg-white p-4 shadow"
                  >

                    <span className="font-bold">
                      {
                        category.name
                      }
                    </span>

                    <button
                      onClick={() =>
                        deleteCategory(
                          category._id
                        )
                      }
                      className="rounded-lg bg-red-100 p-2 text-red-600"
                    >
                      <Trash2
                        size={
                          18
                        }
                      />
                    </button>

                  </div>

                )
              )}

            </div>

          </div>

        )}

      </div>

    </div>
  );
};

export default OwnerDashboard;