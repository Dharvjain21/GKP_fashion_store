import { useState } from "react";
import {
  Plus, Edit2, Trash2, X, Check, Package,
  LayoutDashboard, LogOut, ChevronDown, ChevronUp, Home,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { CATEGORIES, Product } from "../data/products";

interface AdminPageProps {
  onNavigate: (page: string) => void;
}

// ─── Empty form state ────────────────────────────────────────────
const emptyForm = {
  name: "",
  price: "",
  originalPrice: "",
  image: "",
  description: "",
  category: "Sarees",
};

export default function AdminPage({ onNavigate }: AdminPageProps) {
  const { products, addProduct, updateProduct, deleteProduct, logout } = useApp();
  const [view, setView] = useState<"dashboard" | "add" | "manage">("dashboard");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // ── Form change ────────────────────────────────────────────────
  const onFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ── Start edit ─────────────────────────────────────────────────
  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      price: String(p.price),
      originalPrice: String(p.originalPrice ?? ""),
      image: p.image,
      description: p.description,
      category: p.category,
    });
    setView("add");
  };

  // ── Save ───────────────────────────────────────────────────────
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: form.name,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      image: form.image,
      description: form.description,
      category: form.category,
    };

    if (editingId) {
      updateProduct({ ...data, id: editingId });
      setSuccess("Product updated successfully!");
    } else {
      addProduct(data);
      setSuccess("Product added successfully!");
    }

    setForm(emptyForm);
    setEditingId(null);
    setTimeout(() => setSuccess(""), 3000);
    setView("manage");
  };

  // ── Delete ─────────────────────────────────────────────────────
  const handleDelete = (id: string) => {
    deleteProduct(id);
    setDeleteConfirm(null);
    setSuccess("Product deleted.");
    setTimeout(() => setSuccess(""), 2500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ══ Top Admin Bar ══════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-gray-900 text-white px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <img
            src="/gkp-logo.png"
            alt="GKP"
            className="h-8 w-8 object-contain rounded-lg border border-pink-400"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <div>
            <p className="font-bold text-sm">GKP Admin Panel</p>
            <p className="text-[10px] text-pink-300">Guru Kripa Paridhan</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-1.5 text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-full transition"
          >
            <Home size={12} />
            <span className="hidden sm:inline">Store</span>
          </button>
          <button
            onClick={() => { logout(); onNavigate("home"); }}
            className="flex items-center gap-1.5 text-xs bg-rose-600 hover:bg-rose-700 px-3 py-1.5 rounded-full transition"
          >
            <LogOut size={12} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* ══ Nav Tabs ═══════════════════════════════════════════════ */}
      <div className="bg-white border-b border-gray-200 px-4">
        <div className="flex gap-1 max-w-5xl mx-auto">
          {[
            { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { key: "add", label: editingId ? "Edit Product" : "Add Product", icon: Plus },
            { key: "manage", label: "Manage Products", icon: Package },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => {
                if (key !== "add") { setEditingId(null); setForm(emptyForm); }
                setView(key as typeof view);
              }}
              className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-3 border-b-2 transition ${
                view === key
                  ? "border-pink-500 text-pink-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ══ Success Toast ══════════════════════════════════════════ */}
      {success && (
        <div className="fixed bottom-6 right-4 bg-green-600 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 z-50 animate-fadeSlide">
          <Check size={16} />
          {success}
        </div>
      )}

      <main className="max-w-5xl mx-auto w-full px-4 py-6 flex-1">

        {/* ══ DASHBOARD VIEW ════════════════════════════════════ */}
        {view === "dashboard" && (
          <div className="animate-fadeSlide">
            <h2 className="text-xl font-bold text-gray-800 mb-5">Overview</h2>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Products", value: products.length, color: "pink", icon: "🛍️" },
                { label: "Sarees", value: products.filter(p => p.category === "Sarees").length, color: "rose", icon: "👗" },
                { label: "Kurtis", value: products.filter(p => p.category === "Kurtis").length, color: "purple", icon: "👘" },
                { label: "Kids Wear", value: products.filter(p => p.category === "Kids Wear").length, color: "amber", icon: "👶" },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
                  <div className="text-3xl mb-1">{s.icon}</div>
                  <div className="text-2xl font-extrabold text-gray-900">{s.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <h3 className="font-semibold text-gray-700 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setView("add")}
                className="flex items-center gap-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-2xl p-4 transition shadow-md hover:shadow-lg"
              >
                <Plus size={20} />
                <div className="text-left">
                  <p className="font-semibold">Add New Product</p>
                  <p className="text-xs text-pink-100">Upload a new item to the store</p>
                </div>
              </button>
              <button
                onClick={() => setView("manage")}
                className="flex items-center gap-3 bg-white border-2 border-gray-200 hover:border-pink-300 text-gray-700 rounded-2xl p-4 transition"
              >
                <Package size={20} className="text-pink-500" />
                <div className="text-left">
                  <p className="font-semibold">Manage Products</p>
                  <p className="text-xs text-gray-400">Edit or remove existing items</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ══ ADD/EDIT PRODUCT VIEW ═════════════════════════════ */}
        {view === "add" && (
          <div className="animate-fadeSlide">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-800">
                {editingId ? "Edit Product" : "Add New Product"}
              </h2>
              {editingId && (
                <button
                  onClick={() => { setEditingId(null); setForm(emptyForm); }}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  <X size={14} /> Cancel Edit
                </button>
              )}
            </div>

            <form
              onSubmit={handleSave}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {/* Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Product Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={onFormChange}
                  required
                  placeholder="e.g., Banarasi Silk Saree"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-300 bg-gray-50"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Selling Price (₹) *</label>
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={onFormChange}
                  required
                  min="1"
                  placeholder="e.g., 1299"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-300 bg-gray-50"
                />
              </div>

              {/* Original Price */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Original Price (₹) — Optional</label>
                <input
                  name="originalPrice"
                  type="number"
                  value={form.originalPrice}
                  onChange={onFormChange}
                  min="1"
                  placeholder="e.g., 2199"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-300 bg-gray-50"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Category *</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={onFormChange}
                  required
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-300 bg-gray-50"
                >
                  {CATEGORIES.filter((c) => c !== "All").map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Image URL *</label>
                <input
                  name="image"
                  value={form.image}
                  onChange={onFormChange}
                  required
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-300 bg-gray-50"
                />
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Description *</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={onFormChange}
                  required
                  rows={3}
                  placeholder="Describe the product..."
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-300 bg-gray-50 resize-none"
                />
              </div>

              {/* Image Preview */}
              {form.image && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Image Preview</label>
                  <img
                    src={form.image}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded-xl border border-gray-200"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </div>
              )}

              {/* Submit */}
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-3 rounded-xl transition shadow-md hover:shadow-lg"
                >
                  {editingId ? "Update Product" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ══ MANAGE PRODUCTS VIEW ══════════════════════════════ */}
        {view === "manage" && (
          <div className="animate-fadeSlide">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-800">Manage Products</h2>
              <span className="text-xs text-gray-400">{products.length} total</span>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-3">📦</div>
                <p className="text-gray-500">No products yet</p>
                <button
                  onClick={() => setView("add")}
                  className="mt-3 text-pink-500 text-sm font-semibold underline"
                >
                  Add your first product
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {products.map((p) => (
                  <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center gap-3 p-3">
                      {/* Image */}
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-16 w-16 object-cover rounded-xl shrink-0 border border-gray-100"
                      />
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-800 truncate">{p.name}</p>
                        <p className="text-xs text-pink-500 font-medium">{p.category}</p>
                        <p className="text-sm font-bold text-gray-900 mt-0.5">₹{p.price.toLocaleString()}</p>
                      </div>
                      {/* Actions */}
                      <div className="flex flex-col gap-1.5 shrink-0">
                        <button
                          onClick={() => startEdit(p)}
                          className="flex items-center gap-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold px-3 py-1.5 rounded-lg transition"
                        >
                          <Edit2 size={12} /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(p.id)}
                          className="flex items-center gap-1 text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold px-3 py-1.5 rounded-lg transition"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                      {/* Expand Toggle */}
                      <button
                        onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                        className="ml-1 text-gray-400 hover:text-gray-600"
                      >
                        {expandedId === p.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                    {/* Expanded Description */}
                    {expandedId === p.id && (
                      <div className="px-4 pb-3 border-t border-gray-50">
                        <p className="text-xs text-gray-500 mt-2 leading-relaxed">{p.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ══ Delete Confirmation Modal ══════════════════════════════ */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full animate-fadeSlide">
            <div className="text-center">
              <div className="text-4xl mb-3">🗑️</div>
              <h3 className="font-bold text-gray-800 mb-1">Delete Product?</h3>
              <p className="text-sm text-gray-500 mb-5">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2.5 rounded-xl transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
