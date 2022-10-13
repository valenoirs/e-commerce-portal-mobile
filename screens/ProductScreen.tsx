import { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../config/config";

const ProductScreen = ({ navigation }: any) => {
  useEffect(() => {
    AsyncStorage.getItem("user").then((value) => {
      if (!value) {
        return navigation.navigate("Login");
      }
    });
  }, []);

  return (
    <View style={styles.mainContainer}>
      <Text>Product Screen</Text>
    </View>
  );
};

export default ProductScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
