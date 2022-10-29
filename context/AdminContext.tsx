import { createContext, Dispatch, SetStateAction } from 'react'

interface IAdminContextInterface {
  admin: any
  setAdmin: Dispatch<SetStateAction<any>>
  //   setAdmin: Dispatch<SetStateAction<any>>
}

const adminDefaultValue: IAdminContextInterface = {
  admin: {},
  setAdmin: () => {},
}

const AdminContext = createContext<IAdminContextInterface>({
  admin: {},
  setAdmin: () => {},
})

export default AdminContext
