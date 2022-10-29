import { createContext, Dispatch, SetStateAction } from 'react'

interface IUserContextInterface {
  user: any
  setUser: Dispatch<SetStateAction<any>>
  //   setUser: Dispatch<SetStateAction<any>>
}

const cartDefaultValue: IUserContextInterface = {
  user: {},
  setUser: () => {},
}

const UserContext = createContext<IUserContextInterface>({
  user: {},
  setUser: () => {},
})

export default UserContext
