import React, { useEffect, useState, useCallback } from "react";
import { getMenuByDate } from "../api/menuApi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./admin.css";


function MenuViewer() {
  const [menu, setMenu] = useState(null);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().split("T")[0]
  );
  const [paymentStatus, setPaymentStatus] = useState("");
  const [loadingPayment, setLoadingPayment] = useState(false);
  const navigate = useNavigate();

  const fetchMenu = (date) => {
    getMenuByDate(date)
      .then((res) => {
        setMenu(res.data);
        setError("");
      })
      .catch(() => {
        setMenu(null);
        setError("❌ No menu found for this date");
      });
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

      const token = localStorage.getItem('token');
      if (!token) {
        setPaymentStatus("❌ Please log in to place an order.");
        navigate('/login');
        return;
      }

      const phone = prompt("📱 Enter your phone number (e.g., 0712345678 or 254712345678):");
      const customerName = prompt("👤 Enter your name (optional):") || "Anonymous";
      if (!phone) {
        setPaymentStatus("❌ Phone number required.");
        return;
      }

      const normalizedPhone = phone.startsWith('0') ? `254${phone.slice(1)}` : phone;
      if (!normalizedPhone.match(/^2547\d{8}$/)) {
        setPaymentStatus("❌ Invalid phone number format.");
        return;
      }

      const amount = meal.price || 100;
      const foodName = meal.name;
      const menuItemId = meal.id || null; // Assuming meal has an id field

      try {
        setLoadingPayment(true);
        setPaymentStatus("");
        const res = await axios.post(
          "http://localhost:5000/payments/api/payment/initiate",
          { phone: normalizedPhone, amount, food_name: foodName, customer_name: customerName, menu_item_id: menuItemId },
          { 
            headers: { 'Authorization': `Bearer ${token}` },
            timeout: 15000 
          }
        );

        console.log("STK Push Response:", JSON.stringify(res.data, null, 2));
        if (
          res.data?.message === "STK push initiated successfully" &&
          res.data?.response?.ResponseCode === "0"
        ) {
          setPaymentStatus("✅ STK Push initiated. Check your phone to complete payment.");
          setTimeout(() => {
            navigate("/user/orders", { replace: true });
          }, 8000);
        } else {
          const errorMsg =
            res.data?.error ||
            res.data?.response?.ResponseDescription ||
            "Failed to initiate STK Push";
          setPaymentStatus(`❌ Payment failed: ${errorMsg}`);
          console.log("Error details:", { errorMsg, response: res.data });
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
            Menu for {menu.menu_date}
          </h3>

          <div className="meal-list">
            {menu.items.map((meal, index) => (
              <div key={index} className="meal-card">
                {meal.image ? (
                  <img src={meal.image} alt={meal.name} className="meal-image" />
                ) : (
                  <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
                <h3 className="meal-name">{meal.name}</h3>
                <p className="meal-desc">
                  <strong>Description:</strong> {meal.description || "No description"}
                </p>
                <p className="meal-price">
                  <strong>Price:</strong>{" "}
                  {meal.price ? `KSh ${meal.price}` : "N/A"}
                </p>
                <button
                  className="add-button"
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
        <p className="text-center mt-6 font-medium text-blue-600">
          {paymentStatus}
        </p>
      )}
    </div>
  );
}

export default MenuViewer;