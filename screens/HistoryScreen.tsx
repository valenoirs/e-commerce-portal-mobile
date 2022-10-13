import { StyleSheet, View, Text } from "react-native";

const HistoryScreen = ({ navigation }: any) => {
  return (
    <View style={styles.mainContainer}>
      <Text>History Screen</Text>
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
