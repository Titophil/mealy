import React, { useEffect, useState, useCallback } from "react";
import { getMenuByDate } from "../api/menuApi";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MenuViewer() {
  const [menu, setMenu] = useState(null);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().split("T")[0]
  );
  const [paymentStatus, setPaymentStatus] = useState("");
  const [loadingPayment, setLoadingPayment] = useState(false);

  const navigate = useNavigate();

  const fetchMenu = async (date) => {
    try {
      const response = await getMenuByDate(date);
      console.log("API Response:", response.data);

      if (response.data && response.data.items && response.data.items.length > 0) {
        setMenu(response.data);
        setError("");
      } else {
        setMenu(null);
        setError("❌ No menu items found for this date");
      }
    } catch (err) {
      console.error("Fetch Error:", err.response?.data || err.message);
      setMenu(null);
      setError(`❌ Failed to load menu: ${err.response?.data?.message || err.message}`);
    }
  };

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const handleOrder = useCallback(
    async (meal) => {
      if (loadingPayment) return;

      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      let userId = null;

      try {
        userId = user ? JSON.parse(user).id : null;
      } catch (e) {
        console.error("Failed to parse user from localStorage.");
      }

      if (!token) {
        setPaymentStatus("❌ Please log in to place an order.");
        navigate("/login");
        return;
      }

      if (!userId) {
        setPaymentStatus("❌ User information missing.");
        return;
      }

      const phone = prompt("📱 Enter your phone number (e.g., 0712345678 or 254712345678):");
      const customerName = prompt("👤 Enter your name (optional):") || "Anonymous";
      if (!phone) {
        setPaymentStatus("❌ Phone number required.");
        return;
      }

      const normalizedPhone = phone.startsWith("0") ? `254${phone.slice(1)}` : phone;
      if (!/^2547\d{8}$/.test(normalizedPhone)) {
        setPaymentStatus("❌ Invalid phone number format.");
        return;
      }

      const amount = meal.price || 100;
      const foodName = meal.name;
      const menuItemId = meal.menu_item_id || meal.id;

      if (!menuItemId) {
        setPaymentStatus("❌ Invalid menu item selected.");
        return;
      }

      try {
        setLoadingPayment(true);
        setPaymentStatus("");

        const res = await axios.post(
          "http://localhost:5000/payments/api/payment/initiate",
          {
            phone: normalizedPhone,
            amount,
            food_name: foodName,
            customer_name: customerName,
            menu_item_id: menuItemId,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 15000,
          }
        );

        console.log("STK Push Response:", res.data);

        if (
          res.data?.message === "STK push initiated successfully" &&
          res.data?.response?.ResponseCode === "0"
        ) {
          setPaymentStatus("✅ STK Push initiated. Check your phone to complete payment.");

          try {
            const orderRes = await axios.post(
              "http://localhost:5000/orders",
              { menu_item_id: menuItemId, user_id: userId },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Order created:", orderRes.data);
          } catch (orderErr) {
            console.error("Order creation error:", orderErr.response?.data || orderErr.message);
            setPaymentStatus(
              `❌ Payment initiated, but order creation failed: ${
                orderErr.response?.data?.error || orderErr.message
              }`
            );
            return;
          }

          setTimeout(() => {
            navigate("/user/orders", { replace: true });
          }, 8000);
        } else {
          const errorMsg =
            res.data?.error ||
            res.data?.response?.ResponseDescription ||
            "Failed to initiate STK Push";
          setPaymentStatus(`❌ Payment failed: ${errorMsg}`);
        }
      } catch (err) {
        console.error("Payment error:", {
          message: err.message,
          code: err.code,
          response: err.response?.data,
          status: err.response?.status,
        });
        const errorMsg = err.response?.data?.error || err.message || "Unknown error";
        setPaymentStatus(`❌ Payment failed: ${errorMsg}`);
      } finally {
        setLoadingPayment(false);
      }
    },
    [loadingPayment, navigate]
  );

  const debouncedHandleOrder = debounce(handleOrder, 500);

  useEffect(() => {
    fetchMenu(selectedDate);
  }, [selectedDate]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">🍽️ Menu</h2>

      <div className="flex justify-center mb-6">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded shadow"
        />
      </div>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}
      {!menu && !error && <p className="text-center mt-4">Loading...</p>}

      {menu && (
        <>
          <h3 className="text-xl font-semibold mb-4 text-center">
            Menu for {new Date(menu.menu_date).toLocaleDateString()}
          </h3>

          <div className="meal-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menu.items.map((meal, index) => (
              <div
                key={index}
                className="meal-card bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                {meal.image ? (
                  <img
                    src={meal.image}
                    alt={meal.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 rounded-t-lg">
                    No Image
                  </div>
                )}

                <h3 className="meal-name text-lg font-semibold mt-2">{meal.name}</h3>
                <p className="meal-desc text-gray-700">
                  <strong>Description:</strong> {meal.description || "No description"}
                </p>
                <p className="meal-price text-gray-800">
                  <strong>Price:</strong> {meal.price ? `KSh ${meal.price}` : "N/A"}
                </p>
                <button
                  className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                  onClick={() => debouncedHandleOrder(meal)}
                  disabled={loadingPayment}
                >
                  {loadingPayment ? "Processing..." : "Order"}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {paymentStatus && (
        <p className="text-center mt-6 font-medium text-blue-600">{paymentStatus}</p>
      )}
    </div>
  );
}

export default MenuViewer;
