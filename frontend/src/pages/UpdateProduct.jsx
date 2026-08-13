import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProduct, getProductImageUrl, updateProduct } from "../api/productApi";

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

function toInputDate(value) {
  if (!value) return "";
  const [day, month, year] = value.split("-");
  if (!day || !month || !year) return "";
  return `${year}-${month}-${day}`;
}

function toBackendDate(value) {
  if (!value) return null;
  return value.split("-").reverse().join("-");
}

export default function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    getProduct(id)
      .then((res) => {
        const p = res.data;
        setForm({
          name: p.name || "",
          brand: p.brand || "",
          description: p.description || "",
          price: p.price ?? "",
          category: p.category || "",
          quantity: p.quantity ?? "",
          realsedate: toInputDate(p.realsedate),
          available: Boolean(p.available)
        });
        setPreview(getProductImageUrl(p.id));
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load this product.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((old) => ({ ...old, [name]: type === "checkbox" ? checked : value }));
  };

  const imageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : getProductImageUrl(id));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("");

    try {
      setSaving(true);
      const product = {
        name: form.name,
        brand: form.brand,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        quantity: Number(form.quantity),
        available: form.available,
        realsedate: toBackendDate(form.realsedate)
      };

      await updateProduct(id, product, image);
      setStatus("Product updated successfully!");
      setTimeout(() => navigate(`/product/${id}`), 700);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Update failed. Check your Spring Boot PUT endpoint."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="state-box page-state">Loading product...</div>;

  return (
    <main className="page-container">
      <Link to="/manage-products" className="back-link">← Back to Manage Products</Link>
      <section className="form-shell">
        <span className="eyebrow">STORE ADMIN</span>
        <h1>Update Product</h1>
        <p>Change the product details or choose a new image.</p>

        {error && <div className="error-box">{error}</div>}
        {status && <div className="success-box">{status}</div>}

        <form className="add-form" onSubmit={submit}>
          <div className="form-row">
            <Field label="Name">
              <input name="name" value={form.name} onChange={change} required />
            </Field>
            <Field label="Brand">
              <input name="brand" value={form.brand} onChange={change} required />
            </Field>
          </div>

          <Field label="Description">
            <input name="description" value={form.description} onChange={change} required />
          </Field>

          <div className="form-row">
            <Field label="Price">
              <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={change} required />
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
              <input name="quantity" type="number" min="0" value={form.quantity} onChange={change} required />
            </Field>
            <Field label="Release Date">
              <input name="realsedate" type="date" value={form.realsedate} onChange={change} required />
            </Field>
            <Field label="New Image (optional)">
              <input type="file" accept="image/*" onChange={imageChange} />
            </Field>
          </div>

          {preview && (
            <div className="upload-preview">
              <img src={preview} alt="Product preview" />
              <span>{image?.name || "Current product image"}</span>
            </div>
          )}

          <label className="checkbox">
            <input name="available" type="checkbox" checked={form.available} onChange={change} />
            Product Available
          </label>

          <div className="manage-actions">
            <button type="submit" className="primary-btn" disabled={saving}>
              {saving ? "Updating..." : "Update Product"}
            </button>
            <Link to="/manage-products" className="secondary-btn">Cancel</Link>
          </div>
        </form>
      </section>
    </main>
  );
}

function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}
