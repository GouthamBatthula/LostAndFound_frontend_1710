// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import "./ItemsPage.css";

function App() {
  return (
    <Router>
      <nav className="navbar">
        <h1>Lost & Found</h1>
        <div>
          <Link to="/" className="nav-link">Post Item</Link>
          <Link to="/items" className="nav-link">View Items</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<PostItemPage />} />
        <Route path="/items" element={<ItemsPage />} />
      </Routes>
    </Router>
  );
}

export default App;

// ---------------------- POST ITEM PAGE ----------------------

function PostItemPage() {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Lost");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetch("import.meta.env.VITE_API_URL/auth/current_user", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.loggedIn) setUser(data.user);
      })
      .catch((err) => console.log("User not logged in:", err));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !status || !image) {
      alert("Please fill all fields and upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("status", status);
    formData.append("image", image);

    try {
      const res = await fetch("import.meta.env.VITE_API_URL/items", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        alert("Item submitted successfully!");
        setTitle("");
        setDescription("");
        setStatus("Lost");
        setImage(null);
        setPreview(null);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting item.");
    }
  };

  return (
    <div className="content">
      <h2>Welcome to the Lost & Found Platform</h2>
      <p>
        Post your lost or found items here. Make sure to provide clear
        descriptions and upload an image to help others identify the item.
      </p>

      {!user ? (
        <a href="import.meta.env.VITE_API_URL/auth/google">
          <button className="login-btn">Login with Google</button>
        </a>
      ) : (
        <form className="item-form" onSubmit={handleSubmit}>
          <label>
            Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <label>
            Description:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </label>

          <label>
            Status:
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Lost">Lost</option>
              <option value="Found">Found</option>
            </select>
          </label>

          <label>
            Upload Image:
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>

          {preview && (
            <img
              src={preview}
              alt="Preview"
              style={{
                width: "150px",
                marginTop: "10px",
                borderRadius: "10px",
              }}
            />
          )}

          <button type="submit" className="submit-btn">
            Submit Item
          </button>
        </form>
      )}
    </div>
  );
}

// ---------------------- ITEMS PAGE ----------------------

function ItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("import.meta.env.VITE_API_URL/items")
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
