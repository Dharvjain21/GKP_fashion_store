// ─── Product Type ───────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  category: string;
}

// ─── Categories ─────────────────────────────────────────────────
export const CATEGORIES = [
  "All",
  "Sarees",
  "Kurtis",
  "Kids Wear",
  "Lehengas",
  "Suits",
  "Dupatta",
];

// ─── Demo Products ───────────────────────────────────────────────
export const DEMO_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Banarasi Silk Saree",
    price: 1299,
    originalPrice: 2199,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80",
    description:
      "Elegant Banarasi silk saree with intricate zari work and rich golden border. Perfect for weddings and festive occasions. Comes with a matching blouse piece.",
    category: "Sarees",
  },
  {
    id: "2",
    name: "Floral Printed Kurti",
    price: 499,
    originalPrice: 799,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&q=80",
    description:
      "Lightweight floral printed cotton kurti ideal for daily wear. Breathable fabric, vibrant colors, and a relaxed fit make it a must-have for every wardrobe.",
    category: "Kurtis",
  },
  {
    id: "3",
    name: "Kids Ethnic Frock",
    price: 349,
    originalPrice: 599,
    image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500&q=80",
    description:
      "Adorable ethnic frock for little girls with embroidery detailing. Soft fabric, comfortable fit. Available in sizes 2–10 years.",
    category: "Kids Wear",
  },
  {
    id: "4",
    name: "Georgette Lehenga Choli",
    price: 2499,
    originalPrice: 3999,
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500&q=80",
    description:
      "Stunning georgette lehenga choli with mirror work and heavy embroidery. Perfect for Navratri, Diwali, and wedding functions.",
    category: "Lehengas",
  },
  {
    id: "5",
    name: "Cotton Anarkali Kurti",
    price: 649,
    originalPrice: 999,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4f5b?w=500&q=80",
    description:
      "Graceful Anarkali style kurti in pure cotton with block print design. Pairs beautifully with churidar or palazzo. Great for casual and office wear.",
    category: "Kurtis",
  },
  {
    id: "6",
    name: "Chiffon Saree with Blouse",
    price: 899,
    originalPrice: 1499,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80",
    description:
      "Soft chiffon saree with contrast border and ready-made blouse. Light and flowy fabric, ideal for summer parties and casual occasions.",
    category: "Sarees",
  },
  {
    id: "7",
    name: "Boys Kurta Pajama Set",
    price: 429,
    originalPrice: 699,
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500&q=80",
    description:
      "Festive kurta pajama set for boys with embroidery at the collar and cuffs. Available in sizes 2–12 years. Great for Eid, Diwali, and family events.",
    category: "Kids Wear",
  },
  {
    id: "8",
    name: "Palazzo Kurti Combo",
    price: 799,
    originalPrice: 1199,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&q=80",
    description:
      "Stylish kurti with matching palazzo set. Printed design with contrast piping. Super comfortable for all-day wear.",
    category: "Kurtis",
  },
  {
    id: "9",
    name: "Embroidered Dupatta",
    price: 299,
    originalPrice: 499,
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500&q=80",
    description:
      "Hand-embroidered dupatta with mirror and thread work. Can be paired with suits, kurtis, or lehengas. Available in multiple colors.",
    category: "Dupatta",
  },
  {
    id: "10",
    name: "Salwar Suit Set",
    price: 1099,
    originalPrice: 1699,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4f5b?w=500&q=80",
    description:
      "Beautiful 3-piece salwar suit with printed kameez, salwar, and dupatta. Premium fabric with rich embroidery on the neckline.",
    category: "Suits",
  },
  {
    id: "11",
    name: "Net Saree with Embroidery",
    price: 1599,
    originalPrice: 2499,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80",
    description:
      "Party-wear net saree with heavy sequin and thread embroidery all over. Comes with matching blouse and inner lining.",
    category: "Sarees",
  },
  {
    id: "12",
    name: "Kids Sharara Set",
    price: 549,
    originalPrice: 899,
    image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500&q=80",
    description:
      "Cute sharara set for girls with floral embroidery and lace detailing. Includes kurti, sharara, and dupatta. Sizes 3–12 years.",
    category: "Kids Wear",
  },
];
