import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackParamList } from './types';
import AllProductsScreen from '../screens/products/AllProductsScreen';
import ProductsByCategoryScreen from '../screens/products/ProductsByCategoryScreen';

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="AllProducts" 
        component={AllProductsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ProductsByCategory" 
        component={ProductsByCategoryScreen}
        options={({ route }) => ({ 
          title: route.params.categoryName,
          headerBackTitle: 'Back',
        })}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;

