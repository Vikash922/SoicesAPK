import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '@/api/orders';
import { STALE_TIMES } from '@/constants/QueryConfig';
import { useCartStore } from '@/store/useCartStore';

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: orderApi.getOrders,
    staleTime: STALE_TIMES.PRODUCTS, // Reusing products stale time or use a default
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => orderApi.getOrderById(id),
    staleTime: STALE_TIMES.PRODUCTS,
    enabled: !!id,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const clearCart = useCartStore((state) => state.clearCart);

  return useMutation({
    mutationFn: (data: { orderData: any, items: any[] }) => 
      orderApi.createOrder(data.orderData, data.items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      clearCart();
    },
  });
};
