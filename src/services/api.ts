import type { ProductsResponse } from '../types/product';

const API_BASE_URL = 'https://agentic-ecommerce.onrender.com';

// Cart types
export interface CartItem {
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  primary_image: string;
}

export interface CartResponse {
  items: CartItem[];
  item_count: number;
  total: number;
  total_formatted: string;
}

// Fetch cart data
export async function fetchCart(): Promise<CartResponse> {
  const url = `${API_BASE_URL}/user/cart`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch cart: ${response.statusText}`);
    }
    const data: CartResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
}

export interface ProductFilters {
  page?: number;
  page_size?: number;
  is_active?: boolean;
  search?: string | null;
  category?: string | null;
  brand?: string | null;
  min_price?: number | null;
  max_price?: number | null;
  tags?: string | null;
}

// Chat types
export interface ChatSource {
  content: string;
  metadata: {
    primary_image?: string;
    product_id?: number;
    tags?: string;
    price?: number;
    brand?: string;
    category?: string;
    is_featured?: boolean;
    is_active?: boolean;
    source?: string;
  };
  similarity: number;
}

export interface ChatInput {
  query?: string;
  category?: string;
  [key: string]: string | undefined;
}

export interface ChatResponse {
  input: ChatInput;
  answer: string;
  agents_used: string[];
  routing_mode: 'single' | 'sequential' | 'parallel';
  sources: ChatSource[];
  session_id: string;
  elapsed_time_seconds: number;
}

// Send chat query
export async function sendChatQuery(
  query: string,
  sessionId?: string
): Promise<ChatResponse> {
  const url = `${API_BASE_URL}/user/query`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        session_id: sessionId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send query: ${response.statusText}`);
    }

    const data: ChatResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending chat query:', error);
    throw error;
  }
}

// Voucher types
export interface VoucherResponse {
  id: number;
  code: string;
  amount: number;
  is_used: boolean;
}

// Generate voucher
export async function generateVoucher(): Promise<VoucherResponse> {
  const url = `${API_BASE_URL}/user/vouchers/generate`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to generate voucher: ${response.statusText}`);
    }

    const data: VoucherResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating voucher:', error);
    throw error;
  }
}

// Order types
export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface ShippingAddress {
  full_name: string;
  address: string;
  city: string;
  zip_code: string;
}

export interface Order {
  id: number;
  session_id: string;
  voucher_code: string | null;
  total_amount: number;
  status: string;
  created_at: string;
  items: OrderItem[];
  shipping_address: ShippingAddress;
}

// Fetch orders
export async function fetchOrders(): Promise<Order[]> {
  const url = `${API_BASE_URL}/user/orders`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`);
    }
    const data: Order[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}

// Product detail types
export interface ProductDetail {
  name: string;
  sku: string;
  description: string;
  price: string;
  cost_price: string;
  stock_quantity: number;
  low_stock_threshold: number;
  weight: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  category: string;
  tags: string[];
  images: string[];
  primary_image: string;
  is_active: boolean;
  is_featured: boolean;
  brand: string;
  id: number;
  created_at: string;
  updated_at: string;
}

export interface ProductDetailError {
  detail: string;
}

// Fetch single product by ID
export async function fetchProduct(id: number): Promise<ProductDetail> {
  const url = `${API_BASE_URL}/user/products/${id}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
        const errorData: ProductDetailError = await response.json();
        throw new Error(errorData.detail || 'Product not found');
      }
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }
    const data: ProductDetail = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

export async function fetchProducts(
  filters: ProductFilters = {}
): Promise<ProductsResponse> {
  const {
    page = 1,
    page_size = 20,
    is_active = true,
    search = null,
    category = null,
    brand = null,
    min_price = null,
    max_price = null,
    tags = null,
  } = filters;

  const params = new URLSearchParams();
  params.append('is_active', String(is_active));
  params.append('page', String(page));
  params.append('page_size', String(page_size));

  if (search) {
    params.append('search', search);
  }
  if (category) {
    params.append('category', category);
  }
  if (brand) {
    params.append('brand', brand);
  }
  if (min_price !== null && min_price !== undefined) {
    params.append('min_price', String(min_price));
  }
  if (max_price !== null && max_price !== undefined) {
    params.append('max_price', String(max_price));
  }
  if (tags) {
    params.append('tags', tags);
  }

  const url = `${API_BASE_URL}/user/products?${params.toString()}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    const data: ProductsResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}
