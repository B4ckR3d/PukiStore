export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  storeId: string;
  storeName: string;
  type: string;
  stock: number;
}

export interface StoreInfo {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  isVerified: boolean;
}

export interface ProductWithStore {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  comparePrice?: number | null;
  type: string;
  image?: string | null;
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  stock: number;
  sold: number;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  store: StoreInfo;
  _count?: {
    reviews: number;
  };
  avgRating?: number;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers?: number;
  revenueChange: number;
  ordersChange: number;
}

export type UserRole = "ADMIN" | "SELLER" | "CLIENT";
