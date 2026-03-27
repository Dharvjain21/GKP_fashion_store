import { useState, useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";

// ─── Page types ──────────────────────────────────────────────────
type Page = "home" | "product" | "login" | "admin";

function AppContent() {
  const { isAdmin } = useApp();
  const [page, setPage] = useState<Page>("home");
  const [selectedProductId, setSelectedProductId] = useState<string>("");

  // Guard: if not admin, don't show admin page
  useEffect(() => {
    if (page === "admin" && !isAdmin) {
      setPage("login");
    }
  }, [page, isAdmin]);

  const navigate = (target: string) => {
    setPage(target as Page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openProduct = (id: string) => {
    setSelectedProductId(id);
    setPage("product");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Admin page has its own header
  if (page === "admin" && isAdmin) {
    return <AdminPage onNavigate={navigate} />;
  }

  // Login page has its own full layout
  if (page === "login") {
    return <LoginPage onNavigate={navigate} />;
  }

  return (
    <div className="min-h-screen">
      {/* Sticky Navbar always visible on customer pages */}
      <Navbar onNavigate={navigate} currentPage={page} />

      {/* Page Content */}
      {page === "home" && (
        <HomePage onProductClick={openProduct} />
      )}

      {page === "product" && selectedProductId && (
        <ProductDetailPage
          productId={selectedProductId}
          onBack={() => navigate("home")}
        />
      )}
    </div>
  );
}

// ─── Root App with Provider ──────────────────────────────────────
export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
