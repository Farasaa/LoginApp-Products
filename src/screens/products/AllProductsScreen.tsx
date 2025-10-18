import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CustomButton from '../../components/common/Button';
import ProductCard from '../../components/products/ProductCard';
import CategoryChip from '../../components/products/CategoryChip';
import OfflineBanner from '../../components/common/OfflineBanner';
import { useAppSelector } from '../../app/hooks';
import { selectIsSuperadmin } from '../../features/auth/authSlice';
import { useLogout } from '../../api/hooks/useAuth';
import { useProducts, useCategories, useDeleteProduct } from '../../api/hooks/useProducts';
import type { MainStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<MainStackParamList, 'AllProducts'>;

const AllProductsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const isSuperadmin = useAppSelector(selectIsSuperadmin);
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { mutate: deleteProduct } = useDeleteProduct();
  
   
  const { data: productsData, isLoading: isLoadingProducts, refetch: refetchProducts } = useProducts();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  const handleLogout = () => {
    logout();
  };

  const handleCategoryPress = (categorySlug: string, categoryName: string) => {
    navigation.navigate('ProductsByCategory', {
      categoryId: categorySlug,
      categoryName: categoryName,
    });
  };

  const handleDeleteProduct = (productId: number) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteProduct(productId),
        },
      ],
      { cancelable: true }
    );
  };

  const renderCategoryChip = ({ item }: { item: any }) => (
    <CategoryChip
      name={item.name}
      onPress={() => handleCategoryPress(item.slug, item.name)}
    />
  );

  const renderProductCard = ({ item }: { item: any }) => (
    <ProductCard 
      product={item}
      showDeleteButton={isSuperadmin}
      onDelete={handleDeleteProduct}
    />
  );

  if (isLoadingProducts || isLoadingCategories) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <OfflineBanner />
      
      <View style={styles.content}>
        {categories && categories.length > 0 && (
          <View style={styles.categoriesSection}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <FlatList
              data={categories}
              renderItem={renderCategoryChip}
              keyExtractor={(item) => item.slug}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesList}
            />
          </View>
        )}

  
        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>
            All Products ({productsData?.total || 0})
          </Text>
          <FlatList
            data={productsData?.products || []}
            renderItem={renderProductCard}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={refetchProducts}
                colors={['#007AFF']}
              />
            }
          />
        </View>

     
        <View style={styles.bottomHeader}>
          <View style={styles.bottomLeft}>
            <Text style={styles.title}>All Products</Text>
            {isSuperadmin && (
              <View style={styles.adminBadge}>
                <Text style={styles.adminBadgeText}>Admin</Text>
              </View>
            )}
          </View>
          <CustomButton 
            title={isLoggingOut ? "Logging out..." : "Sign Out"}
            onPress={handleLogout}
            disabled={isLoggingOut}
            style={styles.logoutButton}
          />
        </View>
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
  bottomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  bottomLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  adminBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  adminBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  categoriesSection: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  productsSection: {
    flex: 1,
    paddingTop: 16,
  },
  productsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});

export default AllProductsScreen;
