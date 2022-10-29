import { useContext, useEffect, useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Pressable,
  Modal,
  Linking,
  Image,
} from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import config from '../config/config'

import CartContext from '../context/CartContext'
import AdminContext from '../context/AdminContext'
import UserContext from '../context/UserContext'

const ProfileScreen = ({ navigation }: any) => {
  // const [user, setUser] = useState<any>()
  const [orderList, setOrderList] = useState<any>()
  const [modalOrderVisible, setModalOrderVisible] = useState<any>(false)
  const [modalOrderContent, setModalOrderContent] = useState<any>()
  const { cart, setCart } = useContext(CartContext)
  const { setAdmin } = useContext(AdminContext)

  const { user, setUser } = useContext(UserContext)

  useEffect(() => {
    if (user) {
      axios
        .get(`${config.api_host}/api/order?userId=${user.id}`)
        .then((response) => {
          setOrderList(response.data.data.order)
        })
        .catch((error) => alert(error))
    } else {
      setOrderList([])
    }
    // AsyncStorage.getItem('user').then((value: any) => {
    //   setUser(JSON.parse(value))
    // })
    console.log('PROFILE USE EFFECT')
  }, [cart, user])

  const orderOnPressHandler = (content: any) => {
    setModalOrderContent(content)
    setModalOrderVisible(!modalOrderVisible)
  }

  const confirmOrderHandler = (content: any) => {
    axios
      .put(`${config.api_host}/api/order`, {
        id: modalOrderContent._id,
        status: 'Pesanan Diterima',
      })
      .then(async (response) => {
        setModalOrderContent((modalOrderContent: any) => ({
          ...modalOrderContent,
          status: 'Pesanan Diterima',
        }))

        let newOrder = orderList.map((order: any) =>
          order._id === modalOrderContent._id
            ? { ...modalOrderContent, status: 'Pesanan Diterima' }
            : order
        )

        setOrderList(newOrder)
      })
      .catch((error) => alert(error))
  }

  const logoutHandler = () => {
    console.log('User Logged Out')
    AsyncStorage.removeItem('user')
    AsyncStorage.setItem('admin', JSON.stringify([]))
    AsyncStorage.setItem('cart', JSON.stringify([]))
    setCart([])
    setAdmin({})
    setUser({})
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
  }

  return (
    <View style={styles.mainContainer}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalOrderVisible}
        onRequestClose={() => {
          setModalOrderVisible(!modalOrderVisible)
        }}
      >
        <View style={styles.modalContainer}>
          {modalOrderContent ? (
            <View style={styles.modalOrderContent}>
              {/* Modal Informasi Toko Container */}
              <View style={styles.modalTokoContainer}>
                <Text
                  style={styles.modalTokoTitle}
                  onPress={() => {
                    Linking.openURL(
                      'whatsapp://send?phone=62' +
                        modalOrderContent.adminPhone.slice(1)
                    )
                  }}
                >
                  <MaterialCommunityIcons name="store" size={22} />
                  <Text> </Text>
                  {modalOrderContent.adminName}
                  <MaterialCommunityIcons name="whatsapp" size={16} />
                </Text>
                <Text style={styles.modalTokoInvoice}>
                  {modalOrderContent.invoiceId}
                </Text>
                <Text style={styles.modalTokoStatus}>
                  {modalOrderContent.status === 'Pesanan Diterima' ? (
                    <>
                      <MaterialCommunityIcons
                        name="clipboard-check"
                        size={15}
                      />{' '}
                      <Text>{modalOrderContent.status}</Text>
                    </>
                  ) : (
                    <>
                      <MaterialCommunityIcons
                        name="clipboard-clock"
                        size={15}
                      />{' '}
                      <Text>{modalOrderContent.status}</Text>
                    </>
                  )}
                </Text>
                <Text></Text>
                <Text>
                  <MaterialCommunityIcons name="clock-outline" size={14} />
                  <Text> </Text>
                  {modalOrderContent.createdAt.slice(0, 10)}
                </Text>
                {modalOrderContent.isCOD ? (
                  <Text style={{ color: 'gray', fontSize: 12 }}>#COD</Text>
                ) : (
                  <></>
                )}
              </View>
              {/* Modal Product List Container */}
              <View style={styles.modalProductListContainer}>
                <Text style={styles.modalProductListTitle}>
                  Daftar Pesanan :{' '}
                </Text>
                <View style={styles.modalProductListItemListHeader}>
                  <Text
                    style={{
                      flex: 1,
                      ...styles.modalProductListItemListHeaderText,
                    }}
                  >
                    Produk
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      ...styles.modalProductListItemListHeaderText,
                    }}
                  >
                    Jumlah
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      ...styles.modalProductListItemListHeaderText,
                    }}
                  >
                    Harga
                  </Text>
                  <Text style={styles.modalProductListItemListHeaderText}>
                    Total
                  </Text>
                </View>
                {modalOrderContent.product.map((item: any, index: any) => (
                  <View
                    key={item._id + index}
                    style={styles.modalProductListItemList}
                  >
                    <Text
                      style={{
                        flex: 1,
                        ...styles.modalProductListItemListText,
                      }}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        ...styles.modalProductListItemListText,
                      }}
                    >
                      x {item.quantity}
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        ...styles.modalProductListItemListText,
                      }}
                    >
                      Rp.{' '}
                      {item.price
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </Text>
                    <Text style={styles.modalProductListItemListText}>
                      Rp.{' '}
                      {item.productTotal
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </Text>
                  </View>
                ))}
                <View
                  style={{
                    borderTopWidth: 1,
                    borderColor: '#cccccc',
                    paddingTop: 10,
                  }}
                >
                  <Text style={{ alignSelf: 'flex-end', fontSize: 13 }}>
                    Total :{' '}
                    <Text style={{ color: 'green', fontWeight: '500' }}>
                      Rp.{' '}
                      {modalOrderContent.totalPayment
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </Text>
                  </Text>
                </View>
              </View>
              {/* Modal Konfirmasi Terima Barang Container */}
              <View style={styles.confirmOrderContainer}>
                {modalOrderContent.status === 'Pesanan Diterima' ? (
                  <View style={styles.orderConfirmedButton}>
                    <Text style={{ color: 'green', fontWeight: '500' }}>
                      Pesanan Selesai
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.confirmOrderButton}
                    onPress={confirmOrderHandler}
                  >
                    <Text style={{ color: 'white', fontWeight: '500' }}>
                      Konfirmasi Terima Pesanan!
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
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
                Memuat Informasi Pesanan
              </Text>
            </View>
          )}
        </View>
      </Modal>
      {user ? (
        <View style={styles.userContainer}>
          <Text style={styles.userName}>
            <MaterialCommunityIcons name="account-circle" size={22} />
            <Text> </Text>
            {user.name}
          </Text>
          <Text style={styles.userEmail}>
            {/* {user.email} */}
            luckyvalentino@gmail.com
          </Text>
          <Text style={styles.userPhone}>
            <MaterialCommunityIcons
              name="whatsapp"
              size={17}
              style={{ color: 'green' }}
            />
            <Text> </Text>
            {user.phone}
          </Text>
          <Text> </Text>
          <Text style={styles.userLogout} onPress={logoutHandler}>
            <Text>Keluar </Text>
            <MaterialCommunityIcons name="logout" size={15} />
          </Text>
        </View>
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
            Memuat Informasi Pengguna
          </Text>
        </View>
      )}
      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Riwayat :</Text>
        {orderList && orderList.length !== 0 ? (
          <FlatList
            data={orderList}
            renderItem={(itemData) => {
              return (
                <Pressable
                  onPress={() => {
                    orderOnPressHandler(itemData.item)
                  }}
                >
                  <View style={styles.tokoItem}>
                    <View style={styles.tokoItemImageContainer}>
                      <Image
                        style={styles.tokoItemImage}
                        source={require('../assets/toko.png')}
                      />
                    </View>
                    <View style={styles.tokoItemContentContainer}>
                      <Text style={styles.tokoContentTitle}>
                        <MaterialCommunityIcons name="store" size={18} />
                        <Text> </Text>
                        {itemData.item.adminName}
                      </Text>
                      <Text style={styles.tokoContentInvoice}>
                        {itemData.item.invoiceId}
                      </Text>
                      <Text style={styles.tokoContentToko}>
                        {itemData.item.status === 'Pesanan Diterima' ? (
                          <>
                            <MaterialCommunityIcons
                              name="clipboard-check"
                              size={14}
                            />{' '}
                            <Text>{itemData.item.status}</Text>
                          </>
                        ) : (
                          <>
                            <MaterialCommunityIcons
                              name="clipboard-clock"
                              size={14}
                            />{' '}
                            <Text>{itemData.item.status}</Text>
                          </>
                        )}
                      </Text>
                      <Text style={styles.tokoContentCreated}>
                        <MaterialCommunityIcons
                          name="clock-outline"
                          size={14}
                        />
                        <Text> </Text>
                        {itemData.item.createdAt.slice(0, 10)}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              )
            }}
            keyExtractor={(item, index) => {
              return item._id + index
            }}
          ></FlatList>
        ) : (
          <View style={{ alignItems: 'center', marginTop: '25%' }}>
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
              Anda belum memiliki riwayat pesanan.
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  userContainer: {
    flex: 2,
    padding: 30,
    borderBottomWidth: 1,
    borderColor: '#cccccc',
  },
  userName: {
    color: 'green',
    fontWeight: '600',
    fontSize: 22,
  },
  userEmail: {
    color: 'gray',
    fontSize: 13,
    marginBottom: 10,
  },
  userPhone: {
    color: 'grey',
  },
  userLogout: { color: 'red' },
  historyContainer: { flex: 8, padding: 30 },
  historyTitle: {
    color: 'green',
    fontSize: 20,
    fontWeight: '300',
    marginBottom: 15,
  },

  // Modal Order
  modalContainer: {
    flex: 1,
    flexDirection: 'column-reverse',
    alignItems: 'center',
  },
  modalOrderContent: {
    paddingVertical: 30,
    // padding: 30,
    flexDirection: 'column',
    // alignItems: "center",
    width: '100%',
    height: '90%',
    backgroundColor: 'white',
  },

  // Modal Admin Information
  modalTokoContainer: {
    borderBottomColor: '#cccccc',
    borderBottomWidth: 1,
    paddingHorizontal: 30,
    paddingBottom: 15,
  },
  modalTokoTitle: {
    color: 'green',
    fontWeight: '600',
    fontSize: 22,
  },
  modalTokoInvoice: { fontSize: 16, color: 'gray', fontWeight: '400' },
  modalTokoStatus: {
    color: 'gray',
    fontSize: 14,
  },
  modalTokoDescription: {
    color: 'grey',
  },

  // Modal Product List
  modalProductListContainer: {
    flex: 1,
    paddingTop: 15,
    paddingHorizontal: 30,
  },
  modalProductListTitle: {
    color: 'green',
    fontSize: 20,
    fontWeight: '300',
    marginBottom: 15,
  },
  modalProductListItemListHeader: {
    flexDirection: 'row',
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  modalProductListItemListHeaderText: {
    fontWeight: '700',
    color: 'green',
  },
  modalProductListItemList: {
    flexDirection: 'row',
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalProductListItemListText: { padding: 10, fontSize: 13 },

  // Confirm Order Button
  confirmOrderContainer: {
    paddingHorizontal: 15,
  },
  confirmOrderButton: {
    marginVertical: 10,
    alignItems: 'center',
    backgroundColor: 'green',
    width: '100%',
    borderRadius: 10,
    padding: 10,
    height: 42,
  },
  orderConfirmedButton: {
    borderWidth: 1,
    borderColor: '#cccccc',
    marginVertical: 10,
    alignItems: 'center',
    width: '100%',
    borderRadius: 10,
    padding: 10,
    height: 42,
  },

  // Order Item
  tokoItem: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 10,
    // padding: 10,
    marginBottom: 20,
    height: 100,
  },
  tokoItemImageContainer: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderColor: '#cccccc',
  },
  tokoItemImage: { width: '80%', height: '80%' },
  tokoItemContentContainer: { width: '70%', padding: 10 },

  tokoContentTitle: { color: 'green', fontWeight: '600', fontSize: 17 },
  tokoContentInvoice: { color: 'grey', fontWeight: '400', fontSize: 14 },
  tokoContentToko: {
    color: 'grey',
    fontWeight: '400',
    fontSize: 13,
    marginBottom: 3,
  },
  tokoContentCreated: { color: 'grey', fontWeight: '400', fontSize: 13 },
})
