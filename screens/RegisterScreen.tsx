import axios from "axios";
import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { globalStyle } from "../styles/style";

import config from "../config/config";

const RegisterScreen = ({ navigation }: any) => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");

  const handleLogin = (event: any) => {
    if (!name || !email || !phone || !password || !passwordConfirmation) {
      return alert("Harap mengisi semua form yang disediakan.");
    }

    axios
      .post(`${config.api_host}/api/user/signup`, {
        name,
        email,
        phone,
        password,
        passwordConfirmation,
      })
      .then((response) => {
        if (response.status === 200) {
          alert(response.data.message);
          navigation.navigate("Login");
        }
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={{ color: "green", fontSize: 30, fontWeight: "400" }}>
        Daftar
      </Text>
      <TextInput
        style={styles.textInput}
        placeholder="Name"
        onChangeText={(text) => setName(text)}
        value={name}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Phone"
        onChangeText={(text) => setPhone(text)}
        value={phone}
        maxLength={13}
        keyboardType="number-pad"
      />
      <TextInput
        style={styles.textInput}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Confirm"
        secureTextEntry={true}
        onChangeText={(text) => setPasswordConfirmation(text)}
        value={passwordConfirmation}
      />
      <TouchableOpacity style={globalStyle.button} onPress={handleLogin}>
        <Text style={{ color: "#FFFFFF" }}>Daftar</Text>
      </TouchableOpacity>
      <Text>
        Sudah punya akun?{" "}
        <Text
          style={{ color: "green" }}
          onPress={() => navigation.navigate("Login")}
        >
          Masuk
        </Text>{" "}
      </Text>
    </View>
  );
};

export default RegisterScreen;

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
