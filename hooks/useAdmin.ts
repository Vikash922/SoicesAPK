import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, CouponData } from '@/api/admin';

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: adminApi.getAdminStats,
    refetchInterval: 30000,
  });
};

export const useRecentOrders = () => {
  return useQuery({
    queryKey: ['admin', 'recent_orders'],
    queryFn: adminApi.getRecentOrders,
    refetchInterval: 30000,
  });
};

// Product Mutations
export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => adminApi.addProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminApi.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useToggleStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isOutOfStock }: { id: string; isOutOfStock: boolean }) => 
      adminApi.toggleProductStock(id, isOutOfStock),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUploadProductImage = () => {
  return useMutation({
    mutationFn: ({ uri, fileName }: { uri: string; fileName: string }) => 
      adminApi.uploadProductImage(uri, fileName),
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// Coupon Mutations & Queries
export const useCoupons = () => {
  return useQuery({
    queryKey: ['admin', 'coupons'],
    queryFn: adminApi.getCoupons,
  });
};

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CouponData) => adminApi.createCoupon(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] });
    },
  });
};

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] });
    },
  });
};
