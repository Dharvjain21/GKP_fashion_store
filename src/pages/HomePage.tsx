import { useMemo } from "react";
import { Sparkles, ChevronRight, Phone, MapPin, MessageCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/products";
import ProductCard from "../components/ProductCard";

interface HomePageProps {
  onProductClick: (id: string) => void;
}

export default function HomePage({ onProductClick }: HomePageProps) {
  const { products, searchQuery, activeCategory, setActiveCategory } = useApp();

  // ── Filter products by search + category ──────────────────────
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = activeCategory === "All" || p.category === activeCategory;
      const matchSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">

      {/* ══ HERO BANNER ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-100 to-amber-50 px-4 py-10 md:py-16">
        {/* Decorative blobs */}
        <div className="absolute -top-10 -right-10 w-52 h-52 bg-pink-200 opacity-30 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-52 h-52 bg-amber-200 opacity-30 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto text-center animate-fadeSlide">
          {/* Logo + Name */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src="/gkp-logo.png"
              alt="GKP Logo"
              className="h-16 w-16 object-contain rounded-2xl shadow-md border-2 border-pink-200"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <div className="text-left">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                G<span className="text-pink-500">K</span>P
              </h1>
              <p className="text-xs text-gray-500 font-medium">Guru Kripa Paridhan</p>
            </div>
          </div>

          <p className="text-lg md:text-2xl font-semibold text-gray-700 italic mb-1">
            "A variety of all fragrance of colour"
          </p>
          <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
            Premium Indian ethnic wear for the whole family — straight from Jaipur to your doorstep.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setActiveCategory("Sarees")}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold px-6 py-3 rounded-full shadow-md hover:shadow-lg transition"
            >
              <Sparkles size={16} />
              Shop Collection
            </button>
            <a
              href="https://wa.me/919462609295?text=Hi%2C%20I%20want%20to%20browse%20GKP%20collection"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white border border-pink-300 hover:bg-pink-50 text-pink-600 font-semibold px-6 py-3 rounded-full shadow-sm hover:shadow-md transition"
            >
              <MessageCircle size={16} />
              Contact on WhatsApp
            </a>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-6 mt-8">
            {[
              { label: "Products", value: `${products.length}+` },
              { label: "Categories", value: "6+" },
              { label: "Happy Customers", value: "500+" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-xl font-bold text-pink-600">{s.value}</p>
                <p className="text-[11px] text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CATEGORIES CHIPS ═════════════════════════════════════ */}
      <section className="sticky top-[57px] z-40 bg-white/95 backdrop-blur-sm border-b border-pink-100 px-4 py-2.5 shadow-sm">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar max-w-7xl mx-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 text-xs font-semibold px-4 py-1.5 rounded-full border transition ${
                activeCategory === cat
                  ? "bg-pink-500 text-white border-pink-500 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-pink-300 hover:text-pink-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ══ PRODUCT GRID ═════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-3 py-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : activeCategory === "All"
                ? "All Products"
                : activeCategory}
            </h2>
            <p className="text-xs text-gray-400">{filtered.length} items found</p>
          </div>
          {filtered.length > 0 && (
            <span className="flex items-center gap-1 text-xs text-pink-500 font-medium">
              View All <ChevronRight size={14} />
            </span>
          )}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">🛍️</div>
            <p className="text-gray-500 font-medium">No products found</p>
            <p className="text-sm text-gray-400 mt-1">Try a different search or category</p>
            <button
              onClick={() => { setActiveCategory("All"); }}
              className="mt-4 text-sm text-pink-500 font-semibold underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => onProductClick(product.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════════════ */}
      <footer className="bg-gray-900 text-white mt-10">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img
                  src="/gkp-logo.png"
                  alt="GKP"
                  className="h-10 w-10 object-contain rounded-lg border border-pink-400"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
                <div>
                  <p className="font-bold text-lg">GKP</p>
                  <p className="text-[10px] text-pink-300">Guru Kripa Paridhan</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm italic">
                "A variety of all fragrance of colour"
              </p>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-sm mb-3 text-pink-400">Contact Us</h4>
              <div className="space-y-2">
                <a
                  href="https://wa.me/919462609295"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-green-400 transition"
                >
                  <MessageCircle size={14} className="text-green-400" />
                  +91 94626 09295 (WhatsApp)
                </a>
                <a
                  href="tel:9461500684"
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-pink-400 transition"
                >
                  <Phone size={14} className="text-pink-400" />
                  +91 94615 00684
                </a>
              </div>
            </div>

            {/* Address */}
            <div>
              <h4 className="font-semibold text-sm mb-3 text-pink-400">Our Store</h4>
              <div className="flex items-start gap-2 text-sm text-gray-300">
                <MapPin size={14} className="text-pink-400 mt-0.5 shrink-0" />
                <span>Kanak Vihar, Kamla Nehru Nagar,<br />Ajmer Road, Jaipur</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-4 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} GKP – Guru Kripa Paridhan. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
