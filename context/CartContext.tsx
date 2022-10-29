import { createContext, Dispatch, SetStateAction } from 'react'

interface ICartContextInterface {
  cart: any
  setCart: Dispatch<SetStateAction<any>>
  //   setCart: Dispatch<SetStateAction<any>>
}

const cartDefaultValue: ICartContextInterface = {
  cart: {},
  setCart: () => {},
}

const CartContext = createContext<ICartContextInterface>({
  cart: {},
  setCart: () => {},
})

export default CartContext
