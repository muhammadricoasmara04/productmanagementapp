import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/splashscreen/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import ProductScreen from '../screens/product/ProductScreen';
import CategoryScreen from '../screens/category/CategoryScreen';
import CategoryForm from '../screens/category/CaregoryForm';
import ProductFormScreen from '../screens/product/ProductFormScreen';
import StockScreen from '../screens/stock/StockScreen';
import StockFormScreen from '../screens/stock/StockFormScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Stack.Screen
        name="Product"
        component={ProductScreen}
        options={{ title: 'Product' }}
      />
      <Stack.Screen
        name="ProductForm"
        component={ProductFormScreen}
        options={{ title: 'Tambah Produk' }}
      />
      <Stack.Screen
        name="Category"
        component={CategoryScreen}
        options={{ title: 'Category' }}
      />
      <Stack.Screen
        name="CategoryForm"
        component={CategoryForm}
        options={{ title: 'Tambah Kategory' }}
      />
      <Stack.Screen
        name="Stock"
        component={StockScreen}
        options={{ title: 'Stok' }}
      />
      <Stack.Screen
        name="StockForm"
        component={StockFormScreen}
        options={{ title: 'Tambah Stock' }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
