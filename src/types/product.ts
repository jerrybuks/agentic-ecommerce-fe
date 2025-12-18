export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  price: string;
  cost_price: string;
  stock_quantity: number;
  low_stock_threshold: number;
  weight: string;
  dimensions: ProductDimensions;
  category: string;
  tags: string[];
  images: string[];
  primary_image: string;
  is_active: boolean;
  is_featured: boolean;
  brand: string;
  created_at: string;
  updated_at: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  page_size: number;
}

