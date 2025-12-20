import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchCart, fetchOrders, type ProductFilters } from '../services/api';

// Query keys factory for type-safe and consistent keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  featured: () => [...productKeys.all, 'featured'] as const,
};

export const cartKeys = {
  all: ['cart'] as const,
};

export const orderKeys = {
  all: ['orders'] as const,
};

// Hook for fetching featured products on the landing page
export function useFeaturedProducts() {
  return useQuery({
    queryKey: productKeys.featured(),
    queryFn: () => fetchProducts({ page: 1, page_size: 10, is_active: true }),
  });
}

// Hook for fetching products with filters (for the products page)
export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => fetchProducts(filters),
    // Removed keepPreviousData to show loading state immediately on page change
    // This provides immediate feedback when clicking Next/Previous
    refetchOnMount: 'always', // Always refetch when component mounts (page changes)
    staleTime: 1000 * 30, // Data is stale after 30 seconds
  });
}

// Hook for fetching cart
export function useCart() {
  return useQuery({
    queryKey: cartKeys.all,
    queryFn: fetchCart,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

// Hook for fetching orders
export function useOrders() {
  return useQuery({
    queryKey: orderKeys.all,
    queryFn: fetchOrders,
    refetchOnMount: 'always', // Always refetch when component mounts (route navigation)
    refetchOnWindowFocus: true, // Refetch when window regains focus
    staleTime: 1000 * 30, // Data is stale after 30 seconds
  });
}

