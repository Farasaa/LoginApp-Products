import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { productsEndpoints } from '../endpoints/productsEndpoints';
import type { Product, ProductsResponse, Category } from '../endpoints/productsEndpoints';
 
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => productsEndpoints.getAll(),
    staleTime: 5 * 60 * 1000, 
  });
};

 
export const useProductsByCategory = (categorySlug: string) => {
  return useQuery({
    queryKey: ['products', 'category', categorySlug],
    queryFn: () => productsEndpoints.getByCategory(categorySlug),
    enabled: !!categorySlug,
    staleTime: 5 * 60 * 1000, 
  });
};

 
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => productsEndpoints.getAllCategories(),
    staleTime: 10 * 60 * 1000,  
  });
};

 
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) => productsEndpoints.delete(productId),
    
    onMutate: async (productId: number) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });

       
      const previousProducts = queryClient.getQueryData<ProductsResponse>(['products']);

      
      if (previousProducts) {
        queryClient.setQueryData<ProductsResponse>(['products'], {
          ...previousProducts,
          products: previousProducts.products.filter((p) => p.id !== productId),
          total: previousProducts.total - 1,
        });
      }

    
      return { previousProducts };
    },

  
    onSuccess: (data) => {
      Toast.show({
        type: 'success',
        text1: 'Product Deleted!',
        text2: `"${data.title}" was removed successfully`,
      });
    },

   
    onError: (error: any, productId, context) => {
       
      if (context?.previousProducts) {
        queryClient.setQueryData(['products'], context.previousProducts);
      }

      Toast.show({
        type: 'error',
        text1: 'Delete Failed',
        text2: error.response?.data?.message || 'Could not delete product',
      });
    },

    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

 
export type { Product, ProductsResponse, Category };

