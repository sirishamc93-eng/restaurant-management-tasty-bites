import {
  useEffect,
  useState
} from "react";

import {
  Printer
} from "lucide-react";

import API from "../services/api";
import Loading from "../components/Loading";

const Orders = () => {
  const [
    orders,
    setOrders
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  useEffect(() => {
    const fetchOrders =
      async () => {
        try {
          const response =
            await API.get(
              "/orders/my"
            );

          setOrders(
            response.data
          );
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    fetchOrders();
  }, []);

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
              <td>
                ${item.menuItemId.name}
              </td>

              <td>
                ${item.quantity}
              </td>

              <td>
                ₹${item.menuItemId.price}
              </td>

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
          Bill - ${order._id}
        </title>

        <style>

          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            color: #222;
          }

          .bill {
            max-width: 700px;
            margin: auto;
          }

          .header {
            text-align: center;
            margin-bottom: 30px;
          }

          .header h1 {
            margin-bottom: 5px;
            color: #ea580c;
          }

          .details {
            margin-bottom: 25px;
            line-height: 1.7;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th,
          td {
            border-bottom: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }

          th {
            background: #f97316;
            color: white;
          }

          .total {
            margin-top: 25px;
            text-align: right;
            font-size: 22px;
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

          @media print {
            body {
              padding: 10px;
            }
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

            <br />

            <strong>Customer:</strong>
            ${order.userId?.name || "Customer"}

            <br />

            <strong>Email:</strong>
            ${order.userId?.email || ""}

            <br />

            <strong>Date:</strong>
            ${new Date(
              order.createdAt
            ).toLocaleString()}

            <br />

            <strong>Order Status:</strong>
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

            <br />

            <strong>
              Payment Status:
            </strong>

            ${order.paymentStatus}

          </div>

          <div class="footer">

            <p>
              Thank you for ordering from TastyBite!
            </p>

            <p>
              Please keep this bill for your records.
            </p>

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

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-orange-50 px-4 py-10">

      <div className="mx-auto max-w-5xl">

        <h1 className="mb-8 text-4xl font-black">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow">
            <p className="text-gray-500">
              You haven't placed any
              orders yet.
            </p>
          </div>
        ) : (

          <div className="space-y-6">

            {orders.map((order) => (

              <div
                key={order._id}
                className="rounded-2xl bg-white p-6 shadow"
              >

                <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row">

                  <div>

                    <p className="text-sm text-gray-500">
                      Order ID
                    </p>

                    <p className="font-bold">
                      #{order._id.slice(-8)}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Full ID: {order._id}
                    </p>

                  </div>

                  <div className="flex gap-2">

                    <span className="rounded-full bg-orange-100 px-4 py-2 font-semibold text-orange-700">
                      {order.status}
                    </span>

                    <button
                      onClick={() =>
                        printBill(order)
                      }
                      className="flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 font-bold text-white"
                    >
                      <Printer size={18} />
                      Print Bill
                    </button>

                  </div>

                </div>

                <div className="mb-5 rounded-xl bg-gray-50 p-4">

                  <div className="flex justify-between">

                    <span>
                      Payment
                    </span>

                    <span className="font-bold">
                      Cash on Delivery
                    </span>

                  </div>

                  <div className="mt-2 flex justify-between">

                    <span>
                      Payment Status
                    </span>

                    <span
                      className={
                        order.paymentStatus ===
                        "Paid"
                          ? "font-bold text-green-600"
                          : "font-bold text-orange-600"
                      }
                    >
                      {order.paymentStatus}
                    </span>

                  </div>

                </div>

                <div className="space-y-3">

                  {order.items.map(
                    (item) => (

                      <div
                        key={
                          item.menuItemId
                            ._id
                        }
                        className="flex justify-between"
                      >

                        <span>
                          {
                            item
                              .menuItemId
                              .name
                          }{" "}
                          ×{" "}
                          {item.quantity}
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

                <div className="mt-5 flex justify-between border-t pt-4 text-xl font-black">

                  <span>
                    Total
                  </span>

                  <span className="text-orange-600">
                    ₹{order.totalAmount}
                  </span>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
};

export default Orders;