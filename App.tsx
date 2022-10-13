import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import Screen
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProductScreen from "./screens/ProductScreen";
import TokoScreen from "./screens/TokoScreen";
import CartScreen from "./screens/CartScreen";
import ProfileScreen from "./screens/ProfileScreen";
import HistoryScreen from "./screens/LoginScreen";

export default function App() {
  const Stack = createNativeStackNavigator();
  const BottomTab = createBottomTabNavigator();

  // useEffect(() => {
  //   try {
  //     AsyncStorage.removeItem("user");
  //   } catch (error) {}
  // });

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="Product"
          component={ProductScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Toko"
          component={TokoScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Profile"
          component={ProfileScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="History"
          component={HistoryScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Cart"
          component={CartScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Register"
          component={RegisterScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
