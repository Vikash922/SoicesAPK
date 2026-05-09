import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { productApi } from '@/api/products';
import { STALE_TIMES } from '@/constants/QueryConfig';
import { supabase } from '@/lib/supabase';

export const useProducts = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel(`public:products:${Math.random()}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['products'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

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

export const useReviews = (productId: string) => {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => productApi.getReviews(productId),
    staleTime: STALE_TIMES.PRODUCTS,
    enabled: !!productId,
  });
};

export const useCommunityRecipes = (productId: string) => {
  return useQuery({
    queryKey: ['community_recipes', productId],
    queryFn: () => productApi.getCommunityRecipes(productId),
    staleTime: STALE_TIMES.PRODUCTS,
    enabled: !!productId,
  });
};
