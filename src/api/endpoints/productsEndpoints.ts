import apiClient from '../client/apiClient';

 
interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

interface Meta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: Dimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Review[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: Meta;
  images: string[];
  thumbnail: string;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

interface Category {
  slug: string;
  name: string;
  url: string;
}

 
export const productsEndpoints = {
   
  getAll: async (): Promise<ProductsResponse> => {
    const response = await apiClient.get<ProductsResponse>('/products');
    return response.data;
  },

 
  getByCategory: async (categorySlug: string): Promise<ProductsResponse> => {
    const response = await apiClient.get<ProductsResponse>(`/products/category/${categorySlug}`);
    return response.data;
  },

   
  getPaginated: async (limit: number = 30, skip: number = 0): Promise<ProductsResponse> => {
    const response = await apiClient.get<ProductsResponse>(`/products?limit=${limit}&skip=${skip}`);
    return response.data;
  },

 
  getAllCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/products/categories');
    return response.data;
  },

  delete: async (productId: number): Promise<Product> => {
    const response = await apiClient.delete<Product>(`/products/${productId}`);
    return response.data;
  },
};

 
export type { Product, ProductsResponse, Review, Dimensions, Meta, Category };
