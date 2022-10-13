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
      .post("http://192.168.43.219:5000/api/user/signup", {
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
      <Text>Register Screen</Text>
      <TextInput
        placeholder="Name"
        onChangeText={(text) => setName(text)}
        value={name}
      />
      <TextInput
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <TextInput
        placeholder="Phone"
        onChangeText={(text) => setPhone(text)}
        value={phone}
        maxLength={13}
        keyboardType="number-pad"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      <TextInput
        placeholder="Confirm"
        secureTextEntry={true}
        onChangeText={(text) => setPasswordConfirmation(text)}
        value={passwordConfirmation}
      />
      <TouchableOpacity style={globalStyle.button} onPress={handleLogin}>
        <Text>Daftar</Text>
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
});
