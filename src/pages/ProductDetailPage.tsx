import { ArrowLeft, MessageCircle, Tag, Share2, CheckCircle } from "lucide-react";
import { useApp } from "../context/AppContext";

interface ProductDetailPageProps {
  productId: string;
  onBack: () => void;
}

const buildWhatsAppLink = (productName: string) => {
  const msg = encodeURIComponent(
    `Hi, I want to order *${productName}* from GKP (Guru Kripa Paridhan) 🛍️`
  );
  return `https://wa.me/919462609295?text=${msg}`;
};

const getDiscount = (price: number, original?: number) => {
  if (!original || original <= price) return null;
  return Math.round(((original - price) / original) * 100);
};

export default function ProductDetailPage({ productId, onBack }: ProductDetailPageProps) {
  const { products } = useApp();
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50">
        <div className="text-5xl mb-4">😕</div>
        <p className="text-gray-600 font-medium">Product not found</p>
        <button onClick={onBack} className="mt-4 text-pink-500 underline text-sm">
          Go back
        </button>
      </div>
    );
  }

  const discount = getDiscount(product.price, product.originalPrice);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product.name, text: `Check out ${product.name} from GKP!` });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* ── Top Bar ── */}
      <div className="sticky top-[57px] z-40 bg-white/95 backdrop-blur-sm border-b border-pink-100 px-4 py-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-pink-600 transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-pink-500 transition"
        >
          <Share2 size={16} />
          Share
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* ── Product Image ── */}
          <div className="relative rounded-3xl overflow-hidden shadow-lg bg-pink-50">
            <img
              src={product.image}
              alt={product.name}
              className="w-full object-cover"
              style={{ maxHeight: "480px", objectFit: "cover" }}
            />
            {discount && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* ── Product Info ── */}
          <div className="flex flex-col gap-4">
            {/* Category */}
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-pink-600 bg-pink-100 px-3 py-1 rounded-full w-fit border border-pink-200">
              <Tag size={11} />
              {product.category}
            </span>

            {/* Name */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="text-3xl font-extrabold text-gray-900">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through mb-0.5">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  {discount && (
                    <span className="text-sm font-bold text-rose-500 mb-0.5">
                      Save {discount}%
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Features */}
            <div className="flex flex-col gap-2 bg-green-50 border border-green-200 rounded-2xl p-4">
              {["Free delivery on order", "Easy exchange policy", "Genuine quality fabric"].map(
                (f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle size={14} className="text-green-500 shrink-0" />
                    {f}
                  </div>
                )
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-1.5">About this product</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* WhatsApp Button */}
            <a
              href={buildWhatsAppLink(product.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 rounded-2xl shadow-md hover:shadow-lg transition text-base"
            >
              <MessageCircle size={20} />
              Order on WhatsApp
            </a>

            {/* Contact Alt */}
            <p className="text-center text-xs text-gray-400">
              Alternate contact:{" "}
              <a href="tel:9461500684" className="text-pink-500 font-semibold">
                +91 94615 00684
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
