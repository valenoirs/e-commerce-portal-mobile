import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { globalStyle } from "../styles/style";

import config from "../config/config";

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = (event: any) => {
    if (!email || !password) {
      return alert("Harap mengisi semua form yang disediakan.");
    }

    axios
      .post(`${config.api_host}/api/user/signin`, {
        email,
        password,
      })
      .then((response) => {
        try {
          const data = JSON.stringify(response.data.user);
          AsyncStorage.setItem("user", data);
        } catch (error) {
          return;
        }
        navigation.navigate("LoggedInTab");
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={{ color: "green", fontSize: 30, fontWeight: "400" }}>
        Masuk
      </Text>
      <TextInput
        style={styles.textInput}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      <TouchableOpacity style={globalStyle.button} onPress={handleLogin}>
        <Text style={{ color: "#FFFFFF" }}>Masuk</Text>
      </TouchableOpacity>
      <Text>
        Belum punya akun?{" "}
        <Text
          style={{ color: "green" }}
          onPress={() => navigation.navigate("Register")}
        >
          Daftar
        </Text>{" "}
        sekarang.
      </Text>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  textInput: {
    // borderWidth: 1,
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    borderRadius: 3,
    width: "70%",
    marginRight: 8,
    padding: 8,
  },
});
