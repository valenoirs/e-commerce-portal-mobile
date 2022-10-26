import axios from "axios";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  Modal,
  TouchableOpacity,
  Pressable,
  Alert,
  Linking,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import AsyncStorage from "@react-native-async-storage/async-storage";

import config from "../config/config";

import { styles as productStyles } from "./ProductScreen";

const TokoScreen = ({ navigation }: any) => {
  const [tokoList, setTokoList] = useState<any>();
  const [modalTokoVisible, setModalTokoVisible] = useState<boolean>(false);
  const [modalTokoContent, setModalTokoContent] = useState<any>();
  const [modalProductVisible, setModalProductVisible] =
    useState<boolean>(false);
  const [modalProductList, setModalProductList] = useState<any>();
  const [modalProductContent, setModalProductContent] = useState<any>();
  const [modalAdminContent, setModalAdminContent] = useState<any>();
  const [reminder, setReminder] = useState<string>("");
  const [currentCart, setCurrentCart] = useState<Array<any>>([]);
  const [resetCart, setResetCart] = useState<number>(0);

  useEffect(() => {
    axios.get(`${config.api_host}/admin`).then((response) => {
      setTokoList(response.data.data.admin);
    });
    console.log("TOKO USE EFFECT");
  }, []);

  const tokoOnPressHandler = async (content: any) => {
    setReminder("");
    setResetCart(0);
    let admin: any;

    await AsyncStorage.getItem("cart").then((value: any) => {
      setCurrentCart(JSON.parse(value));
    });

    await axios
      .get(`${config.api_host}/product?adminId=${content._id}`)
      .then((response) => {
        setModalProductList(response.data.data.product);
      });

    await AsyncStorage.getItem("admin").then((value: any) => {
      admin = JSON.parse(value);
    });

    if (admin.adminId !== content._id) {
      console.log("RESET");
      setReminder(
        "*Anda mengunjungi toko yang berbeda, menambahkan product akan menghapus produk lain di dalam keranjang."
      );
      setResetCart(1);
    }

    setModalTokoContent(content);
    setModalTokoVisible(!modalTokoVisible);
  };

  const productOnPressHandler = async (content: any) => {
    setModalProductContent({
      available: content.available,
      productId: content._id,
      name: content.name,
      price: content.price,
      quantity: 1,
      picture: content.picture,
      productTotal: content.price,
    });
    setModalAdminContent({
      adminId: content.adminId,
      adminName: content.admin,
      address: modalTokoContent.address,
      rating: modalTokoContent.rating,
      phone: modalTokoContent.phone,
      description: modalTokoContent.description,
    });
    setModalProductVisible(!modalProductVisible);
  };

  const addToCartHandler = async (content: any) => {
    setReminder("");
    let initialCart = currentCart;
    const initialProduct = modalProductContent;

    await AsyncStorage.setItem("admin", JSON.stringify(modalAdminContent));

    // let same = cart.some((product) =>
    //   product.productId.includes(modalProductContent.productId)
    // );

    let same = currentCart.find(
      (product: any) => product.productId === modalProductContent.productId
    );

    if (same) {
      console.log("FOUND ITEM");

      initialProduct.quantity += 1;
      initialProduct.productTotal += modalProductContent.price;

      const newCart = await initialCart.filter(
        (cart) => cart.productId !== initialProduct.productId
      );

      newCart.push(initialProduct);

      setCurrentCart(newCart);
      console.log(currentCart);
    } else if (resetCart && currentCart.length !== 0) {
      console.log("RESET");
      setCurrentCart([initialProduct]);

      console.log(currentCart);

      return await AsyncStorage.setItem(
        "cart",
        JSON.stringify([initialProduct])
      );
    } else {
      console.log("NEW ITEM");
      initialCart.push(initialProduct);
      setCurrentCart(initialCart);
      console.log(currentCart);
    }

    setResetCart(0);

    await AsyncStorage.setItem("cart", JSON.stringify(currentCart));
  };

  return (
    <View style={styles.mainContainer}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalProductVisible}
        onRequestClose={() => {
          setModalProductVisible(!modalProductVisible);
        }}
      >
        <View style={productStyles.modalContainer}>
          {modalProductContent ? (
            <View
              style={productStyles.modalContent}
              onStartShouldSetResponder={() => true}
            >
              <View style={productStyles.modalImageContainer}>
                <Image
                  style={productStyles.modalImage}
                  source={{
                    uri: `${config.api_host}${modalProductContent.picture}`,
                  }}
                />
              </View>
              <View style={productStyles.modalInformationContainer}>
                <Text style={productStyles.modalInformationTitle}>
                  {modalProductContent.name}
                </Text>
                <Text>
                  Rp.{" "}
                  {modalProductContent.price
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
                <Text> </Text>
                {modalTokoContent.isOpen ? (
                  modalProductContent.available ? (
                    <TouchableOpacity
                      style={productStyles.modalButton}
                      onPress={() => addToCartHandler(modalProductContent)}
                    >
                      <Text style={{ color: "white" }}>
                        Tambah ke Keranjang
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={{ color: "red", fontSize: 11 }}>
                      Maaf Produk Habis
                    </Text>
                  )
                ) : (
                  <Text style={{ color: "red", fontSize: 11 }}>
                    Maaf Toko Sedang Tutup
                  </Text>
                )}
              </View>
            </View>
          ) : (
            <Text>Loading</Text>
          )}
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalTokoVisible}
        onRequestClose={() => {
          setModalTokoVisible(!modalTokoVisible);
        }}
      >
        <View style={styles.modalContainer}>
          {modalTokoContent ? (
            <View style={styles.modalTokoContent}>
              <View style={styles.modalTokoContainer}>
                <Text
                  style={styles.modalTokoTitle}
                  onPress={() => {
                    Linking.openURL(
                      "whatsapp://send?phone=62" +
                        modalTokoContent.phone.slice(1)
                    );
                  }}
                >
                  <MaterialCommunityIcons name="store" size={22} />
                  <Text> </Text>
                  {modalTokoContent.name}
                  <MaterialCommunityIcons name="whatsapp" size={16} />
                </Text>
                <Text style={styles.modalTokoAddress}>
                  <MaterialCommunityIcons name="map-marker" size={15} />
                  <Text> </Text>
                  {modalTokoContent.address}
                </Text>
                <Text style={styles.modalTokoAddress}>
                  <MaterialCommunityIcons
                    name="star"
                    size={15}
                    style={{ color: "gold" }}
                  />
                  <Text> </Text>
                  {modalTokoContent.rating}
                </Text>
                <Text style={styles.modalTokoDescription}>
                  {modalTokoContent.description}
                </Text>
                <Text> </Text>
                <Text>
                  {modalTokoContent.isOpen ? (
                    <Text style={{ color: "green" }}>
                      <MaterialCommunityIcons name="door-open" size={15} />
                      <Text> </Text>
                      Buka
                    </Text>
                  ) : (
                    <Text style={{ color: "red" }}>
                      <MaterialCommunityIcons name="door-sliding" size={15} />
                      <Text> </Text>
                      Tutup
                    </Text>
                  )}
                </Text>
              </View>
              <View style={styles.modalProductListContainer}>
                <Text
                  style={{ color: "green", marginBottom: 10, fontSize: 11 }}
                >
                  {reminder}
                </Text>
                {modalProductList ? (
                  <FlatList
                    data={modalProductList}
                    renderItem={(itemData) => {
                      return (
                        <Pressable
                          onPress={() => productOnPressHandler(itemData.item)}
                        >
                          <View style={styles.productItem}>
                            <View style={styles.productItemImageContainer}>
                              <Image
                                style={styles.productItemImage}
                                source={{
                                  uri: `${config.api_host}${itemData.item.picture}`,
                                }}
                              />
                            </View>
                            <View style={styles.productItemContentContainer}>
                              <Text style={styles.productContentTitle}>
                                <MaterialCommunityIcons
                                  name="food-croissant"
                                  size={18}
                                />
                                <Text> </Text>
                                {itemData.item.name}
                                {itemData.item.available ? (
                                  ""
                                ) : (
                                  <Text style={{ color: "red", fontSize: 10 }}>
                                    {" "}
                                    Habis
                                  </Text>
                                )}
                              </Text>
                              <Text style={styles.productContentToko}>
                                <MaterialCommunityIcons
                                  name="store"
                                  size={15}
                                />
                                <Text> </Text>
                                {itemData.item.admin}
                              </Text>
                              <Text style={styles.productContentPrice}>
                                <MaterialCommunityIcons name="cash" size={16} />
                                <Text> </Text>
                                Rp.{" "}
                                {itemData.item.price
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                              </Text>
                              <Text style={styles.productContentDescription}>
                                {itemData.item.description}
                              </Text>
                            </View>
                          </View>
                        </Pressable>
                      );
                    }}
                    keyExtractor={(item, index) => {
                      return item._id;
                    }}
                  ></FlatList>
                ) : (
                  <View style={{ alignItems: "center", marginTop: "50%" }}>
                    <Image
                      style={{ width: 100, height: 100 }}
                      source={require("../assets/toko.png")}
                    />
                    <Text
                      style={{
                        color: "green",
                        fontSize: 15,
                        fontWeight: "300",
                      }}
                    >
                      Toko Belum Memiliki Product
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ) : (
            <View style={{ alignItems: "center", marginTop: "50%" }}>
              <Image
                style={{ width: 100, height: 100 }}
                source={require("../assets/toko.png")}
              />
              <Text
                style={{
                  color: "green",
                  fontSize: 15,
                  fontWeight: "300",
                }}
              >
                Memuat
              </Text>
            </View>
          )}
        </View>
      </Modal>
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchTextInput} placeholder="Cari" />
        <MaterialCommunityIcons
          style={styles.searchButton}
          name="clipboard-search-outline"
          size={24}
          color="green"
        />
      </View>
      <View style={styles.tokoContainer}>
        {tokoList ? (
          <FlatList
            data={tokoList}
            renderItem={(itemData) => {
              return (
                <Pressable
                  onPress={() => {
                    tokoOnPressHandler(itemData.item);
                  }}
                >
                  <View style={styles.tokoItem}>
                    <View style={styles.tokoItemImageContainer}>
                      <Image
                        style={styles.tokoItemImage}
                        source={require("../assets/toko.png")}
                      />
                    </View>
                    <View style={styles.tokoItemContentContainer}>
                      <Text style={styles.tokoContentTitle}>
                        <MaterialCommunityIcons name="store" size={18} />
                        <Text> </Text>
                        {itemData.item.name}
                      </Text>
                      <Text style={styles.tokoContentToko}>
                        <MaterialCommunityIcons name="map-marker" size={15} />
                        <Text> </Text>
                        {itemData.item.address}
                      </Text>
                      <Text style={styles.tokoContentRating}>
                        <MaterialCommunityIcons
                          name="star"
                          size={15}
                          style={{ color: "gold" }}
                        />
                        <Text> </Text>
                        {itemData.item.rating}
                      </Text>
                      <Text></Text>
                      <Text style={styles.tokoContentOpen}>
                        {itemData.item.isOpen ? (
                          <Text style={{ color: "green" }}>
                            <MaterialCommunityIcons
                              name="door-open"
                              size={14}
                            />
                            <Text> </Text>
                            Buka
                          </Text>
                        ) : (
                          <Text style={{ color: "red" }}>
                            <MaterialCommunityIcons
                              name="door-sliding"
                              size={14}
                            />
                            <Text> </Text>
                            Tutup
                          </Text>
                        )}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            }}
            keyExtractor={(item, index) => {
              return item._id;
            }}
          ></FlatList>
        ) : (
          <View style={{ alignItems: "center", marginTop: "50%" }}>
            <Image
              style={{ width: 100, height: 100 }}
              source={require("../assets/toko.png")}
            />
            <Text
              style={{
                color: "green",
                fontSize: 15,
                fontWeight: "300",
              }}
            >
              Memuat Toko
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default TokoScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  modalContainer: {
    flex: 1,
    flexDirection: "column-reverse",
    alignItems: "center",
  },
  modalTokoContent: {
    paddingVertical: 30,
    // padding: 30,
    flexDirection: "column",
    // alignItems: "center",
    width: "100%",
    height: "90%",
    backgroundColor: "white",
  },
  modalTokoContainer: {
    borderBottomColor: "#cccccc",
    borderBottomWidth: 1,
    paddingHorizontal: 30,
    paddingBottom: 15,
  },
  modalTokoTitle: {
    color: "green",
    fontWeight: "600",
    fontSize: 22,
  },
  modalTokoAddress: {
    color: "gray",
    fontSize: 15,
  },
  modalTokoDescription: {
    color: "grey",
  },
  modalProductListContainer: {
    paddingTop: 15,
    paddingHorizontal: 15,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
  },
  searchTextInput: {
    borderBottomWidth: 1,
    borderColor: "#cccccc",
    width: "90%",
    height: "75%",
  },
  searchButton: {
    paddingTop: 10,
    borderBottomWidth: 1,
    borderColor: "#cccccc",
    width: "10%",
    height: "75%",
  },
  tokoContainer: {
    flex: 9,
    flexDirection: "row",
    justifyContent: "center",
    // alignItems: "center",
  },
  tokoItem: {
    flex: 1,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 10,
    // padding: 10,
    marginBottom: 20,
    height: 120,
  },
  tokoItemImageContainer: {
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderColor: "#cccccc",
  },
  tokoItemImage: { width: "80%", height: "80%" },
  tokoItemContentContainer: { width: "70%", padding: 10 },

  tokoContentTitle: { color: "green", fontWeight: "600", fontSize: 17 },
  tokoContentToko: { color: "grey", fontWeight: "400", fontSize: 14 },
  tokoContentOpen: { fontSize: 13 },
  tokoContentRating: { fontWeight: "400", fontSize: 12 },

  productContainer: {
    flex: 9,
    flexDirection: "row",
    justifyContent: "center",
    // alignItems: "center",
  },
  productItem: {
    flex: 1,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 10,
    // padding: 10,
    marginBottom: 20,
    height: 120,
  },
  productItemImageContainer: { width: "30%" },
  productItemImage: {
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 9,
    borderTopLeftRadius: 9,
  },
  productItemContentContainer: { width: "70%", padding: 10 },

  productContentTitle: { color: "green", fontWeight: "600", fontSize: 17 },
  productContentToko: { color: "grey", fontWeight: "400", fontSize: 14 },
  productContentPrice: {},
  productContentDescription: { color: "grey", fontWeight: "400", fontSize: 12 },
});
