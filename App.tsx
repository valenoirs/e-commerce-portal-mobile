import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AsyncStorage from "@react-native-async-storage/async-storage";

// Import Screen
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";

import LoggedInTab from "./components/BottomTab/LoggedInTab";

export default function App() {
  const Stack = createNativeStackNavigator();

  useEffect(() => {
    try {
      // AsyncStorage.removeItem("user");
      AsyncStorage.setItem("cart", JSON.stringify([]));
      AsyncStorage.setItem("admin", JSON.stringify([]));
    } catch (error) {}

    console.log("APP USE EFFECT");
  });

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="LoggedInTab"
          component={LoggedInTab}
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
