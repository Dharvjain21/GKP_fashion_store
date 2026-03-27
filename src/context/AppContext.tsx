import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, DEMO_PRODUCTS } from "../data/products";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function coerceProducts(value: unknown): Product[] | null {
  if (!Array.isArray(value)) return null;

  const coerced: Product[] = [];
  for (const item of value) {
    if (!isRecord(item)) return null;

    const id = item.id;
    const name = item.name;
    const price = item.price;
    const image = item.image;
    const description = item.description;
    const category = item.category;
    const originalPrice = item.originalPrice;

    if (
      typeof id !== "string" ||
      typeof name !== "string" ||
      typeof price !== "number" ||
      typeof image !== "string" ||
      typeof description !== "string" ||
      typeof category !== "string"
    ) {
      return null;
    }

    coerced.push({
      id,
      name,
      price,
      image,
      description,
      category,
      originalPrice: typeof originalPrice === "number" ? originalPrice : undefined,
    });
  }

  return coerced;
}

// ─── Types ───────────────────────────────────────────────────────
interface AppContextType {
  products: Product[];
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  createProduct: (formData: FormData) => Promise<boolean>;
  updateProduct: (id: string, formData: FormData) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeCategory: string;
  setActiveCategory: (c: string) => void;
}

// ─── Admin Credentials ──────────────────────────────────────────
const ADMIN_USER = "gurukripaparidhan123";
const ADMIN_PASS = "greshadharv781621";

const AppContext = createContext<AppContextType | null>(null);

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
function apiUrl(path: string) {
  // If VITE_API_URL is set (recommended on Netlify), use it.
  // Otherwise fall back to same-origin (works if you proxy /api to your backend).
  return API_BASE_URL ? `${API_BASE_URL}${path}` : path;
}

function coerceProduct(value: unknown): Product | null {
  const arr = coerceProducts([value]);
  return arr ? arr[0] : null;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Load products from localStorage or use demo data
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem("gkp_products");
      if (!saved) return DEMO_PRODUCTS;
      const parsed: unknown = JSON.parse(saved);
      return coerceProducts(parsed) ?? DEMO_PRODUCTS;
    } catch {
      return DEMO_PRODUCTS;
    }
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem("gkp_admin") === "true";
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Persist products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("gkp_products", JSON.stringify(products));
  }, [products]);

  // Load products from backend API (if configured)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(apiUrl("/api/products"));
        if (!res.ok) return;
        const data: unknown = await res.json();
        const parsed = coerceProducts(data);
        if (!cancelled && parsed) {
          setProducts(parsed);
        }
      } catch {
        // If API is unavailable, keep localStorage/demo data
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // ── Auth ────────────────────────────────────────────────────────
  const login = (username: string, password: string): boolean => {
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setIsAdmin(true);
      localStorage.setItem("gkp_admin", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem("gkp_admin");
  };

  // ── CRUD (backend API) ───────────────────────────────────────────
  const createProduct = async (formData: FormData): Promise<boolean> => {
    try {
      const res = await fetch(apiUrl("/api/products"), {
        method: "POST",
        body: formData,
      });

      if (!res.ok) return false;
      const created: unknown = await res.json();
      const product = coerceProduct(created);
      if (!product) return false;

      setProducts((prev) => [product, ...prev]);
      return true;
    } catch {
      return false;
    }
  };

  const updateProduct = async (id: string, formData: FormData): Promise<boolean> => {
    try {
      const res = await fetch(apiUrl(`/api/products/${id}`), {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) return false;
      const updated: unknown = await res.json();
      const product = coerceProduct(updated);
      if (!product) return false;

      setProducts((prev) => prev.map((x) => (x.id === id ? product : x)));
      return true;
    } catch {
      return false;
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(apiUrl(`/api/products/${id}`), {
        method: "DELETE",
      });
      if (!res.ok) return false;

      setProducts((prev) => prev.filter((x) => x.id !== id));
      return true;
    } catch {
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        products,
        isAdmin,
        login,
        logout,
        createProduct,
        updateProduct,
        deleteProduct,
        searchQuery,
        setSearchQuery,
        activeCategory,
        setActiveCategory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
