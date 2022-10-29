import AsyncStorage from '@react-native-async-storage/async-storage'
import { useState, useEffect, useCallback, useContext } from 'react'
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
  Linking,
} from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

import config from '../config/config'
import axios from 'axios'

import CartContext from '../context/CartContext'
import AdminContext from '../context/AdminContext'

const CartScreen = ({ navigation }: any) => {
  const [cartProductList, setCartProductList] = useState<Array<any>>([])
  // const [admin, setAdmin] = useState<any>()
  const [user, setUser] = useState<any>()
  const [payment, setPayment] = useState<boolean>(false)
  const [paymentList, setPaymentList] = useState<Array<any>>([
    { label: 'Dana', value: false },
    { label: 'COD', value: true },
  ])
  const [paymentOpen, setPaymentOpen] = useState<boolean>(false)
  const [totalPayment, setTotalPayment] = useState<number>(0)

  const { cart, setCart } = useContext(CartContext)
  const { admin, setAdmin } = useContext(AdminContext)

  useEffect(() => {
    // AsyncStorage.getItem('cart')
    //   .then((value: any) => {
    //     setCartProductList(JSON.parse(value))
    //   })
    //   .then((res) => {
    //     if (cart.length > 0) {
    //       const total = cart
    //         .map((product: any) => product.productTotal)
    //         .reduce((prev: any, next: any) => prev + next)

    //       setTotalPayment(total)
    //     }
    //   })

    if (cart.length > 0) {
      const total = cart
        .map((product: any) => product.productTotal)
        .reduce((prev: any, next: any) => prev + next)

      setTotalPayment(total)
    }

    // AsyncStorage.getItem('admin').then((value: any) => {
    //   setAdmin(JSON.parse(value))
    // })

    AsyncStorage.getItem('user').then((value: any) => {
      setUser(JSON.parse(value))
    })

    console.log('CART USE EFFECT')
  }, [cart])

  const minusButtonHandler = async (content: any) => {
    const initialProduct = content
    // const initialCart = cartProductList

    const newCart = await cart.filter(
      (item: any) => item.productId !== initialProduct.productId
    )

    if (initialProduct.quantity > 1) {
      initialProduct.quantity -= 1
      initialProduct.productTotal -= content.price
      newCart.push(initialProduct)
    }

    setCart(newCart)

    // setCartProductList(newCart)

    // if (cart.length > 0) {
    //   const total = cart
    //     .map((product: any) => product.productTotal)
    //     .reduce((prev: any, next: any) => prev + next)

    //   setTotalPayment(total)
    // }
  }

  const plusButtonHandler = async (content: any) => {
    // const initialProduct = content
    // const initialCart = cart

    // initialProduct.quantity += 1
    // initialProduct.productTotal += content.price

    // const newCart = await initialCart.filter(
    //   (cart: any) => cart.productId !== initialProduct.productId
    // )

    const newCart = cart.map((item: any) =>
      item.productId === content.productId
        ? {
            ...item,
            quantity: item.quantity + 1,
            productTotal: item.productTotal + item.price,
          }
        : item
    )

    setCart(newCart)

    // setCartProductList(newCart)

    // if (cart.length > 0) {
    //   const total = cart
    //     .map((product: any) => product.productTotal)
    //     .reduce((prev: any, next: any) => prev + next)

    //   setTotalPayment(total)
    // }
  }

  const paymentHandler = () => {
    console.log(payment)
  }

  const checkoutHandler = () => {
    const payload = {
      userId: user.id,
      userName: user.name,
      userPhone: user.phone,
      adminId: admin.adminId,
      adminName: admin.adminName,
      adminPhone: admin.phone,
      product: cart,
      totalPayment,
      isCOD: payment,
    }

    axios
      .post(`${config.api_host}/api/order`, payload)
      .then((response) => {
        if (response.status === 200) {
          AsyncStorage.setItem('cart', JSON.stringify([]))
          AsyncStorage.setItem('admin', JSON.stringify([]))
          setCart([])
          setAdmin({})
        }
        alert(response.data.message)
      })
      .catch((error) => {
        alert(error)
      })
  }

  return (
    <View style={styles.mainContainer}>
      {cart?.length !== 0 ? (
        <>
          {/* Admin Panel */}
          <View style={styles.adminContainer}>
            {admin ? (
              <View>
                <Text
                  style={styles.adminTitle}
                  onPress={() => {
                    Linking.openURL(
                      'whatsapp://send?phone=62' + admin.phone.slice(1)
                    )
                  }}
                >
                  <MaterialCommunityIcons name="store" size={22} />
                  <Text> </Text>
                  {admin.adminName}
                  <MaterialCommunityIcons name="whatsapp" size={16} />
                </Text>
                <Text style={styles.adminAddress}>
                  <MaterialCommunityIcons name="map-marker" size={15} />
                  <Text> </Text>
                  {admin.address}
                </Text>
                <Text style={styles.adminAddress}>
                  <MaterialCommunityIcons
                    name="star"
                    size={15}
                    style={{ color: 'gold' }}
                  />
                  <Text> </Text>
                  {admin.rating}
                </Text>
                <Text style={styles.adminDescription}>{admin.description}</Text>
                <Text> </Text>
                <View style={styles.paymentDropdownContainer}>
                  <DropDownPicker
                    style={styles.paymentDropdown}
                    dropDownContainerStyle={
                      styles.paymentDropdownPickerContainer
                    }
                    open={paymentOpen}
                    value={payment}
                    items={paymentList}
                    setOpen={setPaymentOpen}
                    setValue={setPayment}
                    setItems={setPaymentList}
                    placeholder="Metode Pembayaran"
                    placeholderStyle={styles.paymentDropdownPlaceholder}
                    onChangeValue={paymentHandler}
                    zIndex={1000}
                    zIndexInverse={3000}
                  />
                </View>
              </View>
            ) : (
              <Text>Loading Admin</Text>
            )}
          </View>
          {/* Product List */}
          <View style={{ zIndex: -1, ...styles.productContainer }}>
            <FlatList
              data={cart}
              renderItem={(itemData) => {
                return (
                  <Pressable>
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
                        </Text>
                        <Text style={styles.productContentPrice}>
                          <MaterialCommunityIcons name="cash" size={16} />
                          <Text> </Text>
                          Rp.{' '}
                          {itemData.item.price
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        </Text>
                        <Text style={styles.productContentPrice}>
                          <MaterialCommunityIcons
                            name="cash-register"
                            size={16}
                          />
                          <Text> </Text>
                          Rp.{' '}
                          {itemData.item.productTotal
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        </Text>
                        <Text></Text>
                        <View style={{ flexDirection: 'row' }}>
                          <TouchableOpacity
                            style={{
                              padding: 1,
                              borderWidth: 1,
                              borderColor: '#cccccc',
                              borderRadius: 10,
                              width: '15%',
                              alignItems: 'center',
                            }}
                            onPress={() => minusButtonHandler(itemData.item)}
                          >
                            <Text style={{ color: 'green' }}>-</Text>
                          </TouchableOpacity>
                          <Text> {itemData.item.quantity} </Text>
                          <TouchableOpacity
                            style={{
                              padding: 1,
                              backgroundColor: 'green',
                              borderRadius: 10,
                              width: '15%',
                              alignItems: 'center',
                            }}
                            onPress={() => plusButtonHandler(itemData.item)}
                          >
                            <Text style={{ color: 'white' }}>+</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </Pressable>
                )
              }}
              keyExtractor={(item, index) => {
                return item.name + index
              }}
            ></FlatList>
          </View>
          <View style={styles.checkoutContainer}>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={checkoutHandler}
            >
              <Text style={{ color: 'white', fontWeight: '500' }}>
                Checkout! ( Rp.{' '}
                {totalPayment?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                )
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={{ alignItems: 'center', marginTop: '70%' }}>
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
            Keranjang Anda Kosong + {cart.test}
          </Text>
        </View>
      )}
    </View>
  )
}

export default CartScreen

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  paymentDropdownContainer: { width: '75%' },
  paymentDropdown: { borderColor: '#B7B7B7', height: 1 },
  paymentDropdownPlaceholder: { color: 'grey' },
  paymentDropdownPickerContainer: { borderColor: '#B7B7B7', color: 'grey' },
  adminContainer: {
    flex: 3,
    flexDirection: 'column',
    borderBottomColor: '#cccccc',
    borderBottomWidth: 1,
    paddingTop: 30,
    paddingHorizontal: 30,
  },
  adminTitle: {
    color: 'green',
    fontWeight: '600',
    fontSize: 22,
  },
  adminAddress: {
    color: 'gray',
    fontSize: 15,
  },
  adminDescription: {
    color: 'grey',
  },
  productContainer: {
    flex: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    // alignItems: "center",
    marginVertical: 10,
  },
  productItem: {
    flex: 2,
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

  checkoutContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
  },
  checkoutButton: {
    marginVertical: 10,
    alignItems: 'center',
    backgroundColor: 'green',
    width: '100%',
    borderRadius: 10,
    padding: 10,
  },
})
