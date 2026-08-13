import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../api/productApi";

const initialForm = {
  name: "",
  brand: "",
  description: "",
  price: "",
  category: "",
  quantity: "",
  realsedate: "",
  available: false
};

export default function AddProduct() {
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((old) => ({ ...old, [name]: type === "checkbox" ? checked : value }));
  };

  const imageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : "");
  };

  const submit = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");

    if (!image) {
      setError("Please choose a product image.");
      return;
    }

    try {
      setLoading(true);

      const [year, month, day] = form.realsedate.split("-");
      const product = {
        name: form.name,
        brand: form.brand,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        quantity: Number(form.quantity),
        available: form.available,
        realsedate: form.realsedate ? `${day}-${month}-${year}` : null
      };

      await addProduct(product, image);

      setStatus("Product added successfully!");
      setForm(initialForm);
      setImage(null);
      setPreview("");
      document.getElementById("image").value = "";
      setTimeout(() => navigate("/"), 900);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Could not add the product. Check your Spring Boot endpoint and CORS."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-container">
      <div className="page-heading compact">
        <p className="eyebrow">STORE ADMIN</p>
        <h1>Add Product</h1>
        <p>Add a new product with its image to your store.</p>
      </div>

      <form className="add-form" onSubmit={submit}>
        <div className="form-row">
          <Field label="Name">
            <input name="name" value={form.name} onChange={change} required placeholder="Product name" />
          </Field>
          <Field label="Brand">
            <input name="brand" value={form.brand} onChange={change} required placeholder="Brand" />
          </Field>
        </div>

        <Field label="Description">
          <input name="description" value={form.description} onChange={change} required placeholder="Product description" />
        </Field>

        <div className="form-row">
          <Field label="Price">
            <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={change} required placeholder="Eg: 1000" />
          </Field>
          <Field label="Category">
            <select name="category" value={form.category} onChange={change} required>
              <option value="">Select category</option>
              <option>Electronics</option>
              <option>Mobiles</option>
              <option>Laptops</option>
              <option>Accessories</option>
              <option>Clothing</option>
              <option>Home</option>
            </select>
          </Field>
        </div>

        <div className="form-row three">
          <Field label="Stock Quantity">
            <input name="quantity" type="number" min="0" value={form.quantity} onChange={change} required placeholder="Stock Remaining" />
          </Field>
          <Field label="Release Date">
            <input name="realsedate" type="date" value={form.realsedate} onChange={change} required />
          </Field>
          <Field label="Image">
            <input id="image" type="file" accept="image/*" onChange={imageChange} required />
          </Field>
        </div>

        {preview && (
          <div className="upload-preview">
            <img src={preview} alt="Preview" />
            <span>{image?.name}</span>
          </div>
        )}

        <label className="checkbox">
          <input name="available" type="checkbox" checked={form.available} onChange={change} />
          Product Available
        </label>

        {status && <div className="success-box">{status}</div>}
        {error && <div className="error-box">{error}</div>}

        <button className="primary-btn" disabled={loading}>
          {loading ? "Submitting..." : "Submit Product"}
        </button>
      </form>
    </main>
  );
}

function Field({ label, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}
