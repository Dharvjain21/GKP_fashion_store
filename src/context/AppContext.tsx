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
  addProduct: (p: Omit<Product, "id">) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeCategory: string;
  setActiveCategory: (c: string) => void;
}

// ─── Admin Credentials ──────────────────────────────────────────
const ADMIN_USER = "gurukripaparidhan123";
const ADMIN_PASS = "greshadharv781621";

const AppContext = createContext<AppContextType | null>(null);

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

  // ── CRUD ────────────────────────────────────────────────────────
  const addProduct = (p: Omit<Product, "id">) => {
    const newProduct: Product = { ...p, id: Date.now().toString() };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (p: Product) => {
    setProducts((prev) => prev.map((x) => (x.id === p.id ? p : x)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((x) => x.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        products,
        isAdmin,
        login,
        logout,
        addProduct,
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
