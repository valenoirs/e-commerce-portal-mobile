import { Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import ProductScreen from "../../screens/ProductScreen";
import TokoScreen from "../../screens/TokoScreen";
import CartScreen from "../../screens/CartScreen";
import ProfileScreen from "../../screens/ProfileScreen";
import HistoryScreen from "../../screens/HistoryScreen";

const HeaderLogo = () => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 10,
      }}
    >
      <MaterialCommunityIcons name="store" size={24} color="white" />
      <Text style={{ fontWeight: "500", fontSize: 20, color: "white" }}>
        {" "}
        <Text style={{ fontWeight: "500" }}>UMKM</Text>{" "}
        <Text style={{ fontWeight: "200" }}>Market</Text>
      </Text>
    </View>
  );
};

const headerStyle = {
  headerTitle: (props: any) => <HeaderLogo {...props} />,
  // title: "E-Commerce",
  headerStyle: {
    backgroundColor: "green",
    height: 100,
  },
  headerTintColor: "white",
};

const LoggedInTab = () => {
  const BottomTab = createBottomTabNavigator();
  return (
    <BottomTab.Navigator
      initialRouteName="Product"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === "Product") {
            iconName = focused ? "food" : "food-outline";
          } else if (route.name === "Toko") {
            iconName = focused ? "store" : "store-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "account" : "account-outline";
          } else if (route.name === "History") {
            iconName = focused ? "calendar-clock" : "calendar-clock-outline";
          } else if (route.name === "Cart") {
            iconName = focused ? "cart" : "cart-outline";
          }

          // You can return any component that you like here!
          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: "green",
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: { paddingBottom: 10 },
        tabBarStyle: { padding: 10, height: 70 },
      })}
    >
      <BottomTab.Screen
        options={headerStyle}
        name="Product"
        component={ProductScreen}
      />
      <BottomTab.Screen
        options={headerStyle}
        name="Toko"
        component={TokoScreen}
      />
      {/* <BottomTab.Screen
        options={headerStyle}
        name="History"
        component={HistoryScreen}
      /> */}
      <BottomTab.Screen
        options={headerStyle}
        name="Cart"
        component={CartScreen}
      />
      <BottomTab.Screen
        options={headerStyle}
        name="Profile"
        component={ProfileScreen}
      />
    </BottomTab.Navigator>
  );
};

export default LoggedInTab;
