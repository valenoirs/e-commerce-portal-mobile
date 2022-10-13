import { StyleSheet, View, Text } from "react-native";

const ProfileScreen = ({ navigation }: any) => {
  return (
    <View style={styles.mainContainer}>
      <Text>Profile Screen</Text>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
