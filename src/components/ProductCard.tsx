import { MessageCircle, Tag } from "lucide-react";
import { Product } from "../data/products";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

// ── WhatsApp order link builder ──────────────────────────────────
const buildWhatsAppLink = (productName: string) => {
  const msg = encodeURIComponent(
    `Hi, I want to order *${productName}* from GKP (Guru Kripa Paridhan) 🛍️`
  );
  return `https://wa.me/919462609295?text=${msg}`;
};

// ── Discount % calculator ────────────────────────────────────────
const getDiscount = (price: number, original?: number) => {
  if (!original || original <= price) return null;
  return Math.round(((original - price) / original) * 100);
};

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const discount = getDiscount(product.price, product.originalPrice);

  return (
    <div
      className="product-card bg-white rounded-2xl overflow-hidden shadow-sm border border-pink-50 cursor-pointer"
      onClick={onClick}
    >
      {/* ── Product Image ── */}
      <div className="relative overflow-hidden bg-pink-50" style={{ paddingBottom: "110%" }}>
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-400 hover:scale-105"
          loading="lazy"
        />
        {/* Discount Badge */}
        {discount && (
          <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full pulse-badge">
            {discount}% OFF
          </span>
        )}
        {/* Category Tag */}
        <span className="absolute top-2 right-2 bg-white/90 text-pink-600 text-[9px] font-semibold px-2 py-0.5 rounded-full border border-pink-200 flex items-center gap-0.5">
          <Tag size={8} />
          {product.category}
        </span>
      </div>

      {/* ── Product Info ── */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-800 leading-tight mb-1 line-clamp-1">
          {product.name}
        </h3>

        {/* Price Row */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="text-base font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* WhatsApp Button */}
        <a
          href={buildWhatsAppLink(product.name)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-center gap-1.5 w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-xs font-semibold py-2 rounded-xl transition shadow-sm hover:shadow-md"
        >
          <MessageCircle size={13} />
          Order on WhatsApp
        </a>
      </div>
    </div>
  );
}
