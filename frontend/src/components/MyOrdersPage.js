import React, { useEffect, useState } from "react";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/orders/myorders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Erreur lors de la récupération des commandes");
        }
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // (Optionnel) Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);

  }, [token]);

  if (loading) return <p>Chargement des commandes...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Mes commandes</h2>
      {orders.length === 0 ? (
        <p>Aucune commande trouvée.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>ID</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Date</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Total</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Statut</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {order._id}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  ${order.total.toFixed(2)}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  <span
                    style={{
                      color:
                        order.status === "pending"
                          ? "orange"
                          : order.status === "processing"
                          ? "blue"
                          : order.status === "shipped"
                          ? "purple"
                          : order.status === "delivered"
                          ? "green"
                          : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyOrdersPage;
