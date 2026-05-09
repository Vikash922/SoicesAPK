import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/api/products';
import { STALE_TIMES } from '@/constants/QueryConfig';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: productApi.getProducts,
    staleTime: STALE_TIMES.PRODUCTS,
  });
};

export const useTrendingProducts = () => {
  return useQuery({
    queryKey: ['products', 'trending'],
    queryFn: productApi.getTrendingProducts,
    staleTime: STALE_TIMES.PRODUCTS,
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productApi.getProductById(id),
    staleTime: STALE_TIMES.PRODUCTS,
    enabled: !!id,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: productApi.getCategories,
    staleTime: STALE_TIMES.CATEGORIES,
  });
};
