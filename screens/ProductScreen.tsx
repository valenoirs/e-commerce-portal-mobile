import { useEffect, useState, useContext } from 'react'
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  Image,
  Modal,
  TouchableOpacity,
  Pressable,
} from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

import config from '../config/config'
import UserContext from '../context/UserContext'

const ProductScreen = ({ navigation }: any) => {
  const [productList, setProductList] = useState<any>()
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [modalContent, setModalContent] = useState<any>()
  const [searchInput, setSearchInput] = useState<string>('')

  const { user, setUser } = useContext(UserContext)

  useEffect(() => {
    axios.get(`${config.api_host}/product`).then((response) => {
      setProductList(response.data.data.product)
    })

    AsyncStorage.getItem('user').then((value) => {
      if (!value) {
        return navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
      } else {
        setUser(JSON.parse(value))
      }
    })

    console.log('PRODUCT USE EFFECT')
    // AsyncStorage.getItem("cart").then((value) => {
    //   if (!value) {
    //     AsyncStorage.setItem("cart", JSON.stringify([]));
    //   }
    // });
  }, [])

  const productSearchHandler = async () => {
    axios
      .get(`${config.api_host}/product?search=${searchInput}`)
      .then((response) => {
        setProductList(response.data.data.product)
      })
  }

  const productOnPressHandler = (content: any) => {
    setModalContent(content)
    setModalVisible(!modalVisible)
  }

  const cariTokoHandler = async () => {
    navigation.navigate('Toko')
  }

  return (
    <View style={styles.mainContainer}>
      {/* Modal Add to Cart */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible)
        }}
      >
        <View style={styles.modalContainer}>
          {modalContent ? (
            <View
              style={styles.modalContent}
              onStartShouldSetResponder={() => true}
            >
              <View style={styles.modalImageContainer}>
                <Image
                  style={styles.modalImage}
                  source={{ uri: `${config.api_host}${modalContent.picture}` }}
                />
              </View>
              <View style={styles.modalInformationContainer}>
                <Text style={styles.modalInformationTitle}>
                  {modalContent.name}
                </Text>
                <Text style={styles.productContentToko}>
                  {modalContent.admin}
                </Text>
                <Text>
                  Rp.{' '}
                  {modalContent.price
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </Text>
                <Text> </Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={cariTokoHandler}
                >
                  <Text style={{ color: 'white' }}>Cari Toko</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <Text>Loading</Text>
          )}
        </View>
      </Modal>
      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchTextInput}
          placeholder="Cari"
          onChangeText={(text) => setSearchInput(text)}
          value={searchInput}
        />
        <MaterialCommunityIcons
          style={styles.searchButton}
          name="clipboard-search-outline"
          size={24}
          color="green"
          onPress={productSearchHandler}
        />
      </View>
      {/* Product List */}
      <View style={styles.productContainer}>
        {productList ? (
          <FlatList
            data={productList}
            renderItem={(itemData) => {
              return (
                <Pressable onPress={() => productOnPressHandler(itemData.item)}>
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
                          ''
                        ) : (
                          <Text style={{ color: 'red', fontSize: 10 }}>
                            {' '}
                            Habis
                          </Text>
                        )}
                      </Text>
                      <Text style={styles.productContentToko}>
                        <MaterialCommunityIcons name="store" size={15} />
                        <Text> </Text>
                        {itemData.item.admin}
                      </Text>
                      <Text style={styles.productContentPrice}>
                        <MaterialCommunityIcons name="cash" size={16} />
                        <Text> </Text>
                        Rp.{' '}
                        {itemData.item.price ? (
                          <>
                            {itemData.item.price
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          </>
                        ) : (
                          <>{itemData.item.price}</>
                        )}
                      </Text>
                      <Text style={styles.productContentDescription}>
                        {itemData.item.description}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              )
            }}
            keyExtractor={(item, index) => {
              return item._id
            }}
          ></FlatList>
        ) : (
          <View style={{ alignItems: 'center', marginTop: '50%' }}>
            <Image
              style={{ width: 100, height: 100 }}
              source={require('../assets/toko.png')}
            />
            <Text
              style={{
                color: 'green',
                fontSize: 15,
                fontWeight: '300',
              }}
            >
              Memuat Product
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default ProductScreen

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  modalContainer: {
    flex: 1,
    flexDirection: 'column-reverse',
    alignItems: 'center',
  },
  modalContent: {
    paddingVertical: 30,
    padding: 15,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#cccccc',
    justifyContent: 'center',
    width: '100%',
    height: 205,
    backgroundColor: 'white',
  },
  modalImageContainer: { width: '30%', paddingBottom: 30 },
  modalImage: { width: '100%', height: '100%', borderRadius: 20 },
  modalInformationContainer: {
    width: '70%',
    padding: 10,
    alignItems: 'center',
  },
  modalInformationTitle: {
    color: 'green',
    fontWeight: '600',
    fontSize: 17,
  },
  modalButton: {
    backgroundColor: 'green',
    width: 125,
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
  },
  searchTextInput: {
    borderBottomWidth: 1,
    borderColor: '#cccccc',
    width: '90%',
    height: '75%',
  },
  searchButton: {
    paddingTop: 10,
    borderBottomWidth: 1,
    borderColor: '#cccccc',
    width: '10%',
    height: '75%',
  },
  productContainer: {
    flex: 9,
    flexDirection: 'row',
    justifyContent: 'center',
    // alignItems: "center",
  },
  productItem: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 10,
    // padding: 10,
    marginBottom: 20,
    height: 120,
  },
  productItemImageContainer: { width: '30%' },
  productItemImage: {
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: 9,
    borderTopLeftRadius: 9,
  },
  productItemContentContainer: { width: '70%', padding: 10 },

  productContentTitle: { color: 'green', fontWeight: '600', fontSize: 17 },
  productContentToko: { color: 'grey', fontWeight: '400', fontSize: 14 },
  productContentPrice: {},
  productContentDescription: { color: 'grey', fontWeight: '400', fontSize: 12 },
})
