// src/ItemsPage.js
import React, { useEffect, useState } from "react";
import "./ItemsPage.css";

function ItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/items")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching items:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading items...</h2>;

  return (
    <div className="items-container">
      <h1 className="page-title">All Lost & Found Items</h1>
      <div className="items-grid">
        {items.map((item) => (
          <div key={item._id} className="item-card">
            <img src={item.imageUrl} alt={item.title} className="item-image" />
            <div className="item-details">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span
                className={`status-badge ${
                  item.status === "Lost" ? "lost" : "found"
                }`}
              >
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ItemsPage;
