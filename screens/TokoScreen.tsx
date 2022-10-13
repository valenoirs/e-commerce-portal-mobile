import { StyleSheet, View, Text } from "react-native";

const TokoScreen = ({ navigation }: any) => {
  return (
    <View style={styles.mainContainer}>
      <Text>Toko Screen</Text>
    </View>
  );
};

export default TokoScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
