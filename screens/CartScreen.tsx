import { StyleSheet, View, Text } from "react-native";

const CartScreen = ({ navigation }: any) => {
  return (
    <View style={styles.mainContainer}>
      <Text>Cart Screen</Text>
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
