import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import ProductCard from '../../components/products/ProductCard';
import OfflineBanner from '../../components/common/OfflineBanner';
import { useProductsByCategory } from '../../api/hooks/useProducts';
import type { MainStackParamList } from '../../navigation/types';

type ProductsByCategoryRouteProp = RouteProp<MainStackParamList, 'ProductsByCategory'>;

const ProductsByCategoryScreen = () => {
  const route = useRoute<ProductsByCategoryRouteProp>();
  const { categoryId, categoryName } = route.params;

  
  const { data: productsData, isLoading, refetch } = useProductsByCategory(categoryId);

  const renderProductCard = ({ item }: { item: any }) => (
    <ProductCard product={item} />
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading {categoryName}...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const products = productsData?.products || [];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
      
        <OfflineBanner />
         
        <View style={styles.header}>
          <Text style={styles.categoryName}>{categoryName}</Text>
          <Text style={styles.productCount}>
            {products.length} {products.length === 1 ? 'Product' : 'Products'}
          </Text>
        </View>

         
        {products.length === 0 ? (
          <View style={styles.centerContent}>
            <Text style={styles.emptyText}>No products in this category</Text>
          </View>
        ) : (
          <FlatList
            data={products}
            renderItem={renderProductCard}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={refetch}
                colors={['#007AFF']}
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  productCount: {
    fontSize: 14,
    color: '#666',
  },
  productsList: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default ProductsByCategoryScreen;

