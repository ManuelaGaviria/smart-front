import { createContext, useState } from "react";

const GeneralContext = createContext()

export const GeneralProvider = ({children}) => {

    const [name, setName] = useState("")
    const changeName = (e) => {
        setName(e.target.value)
    }

    const [password, setPassword] = useState("")
    const changePassword = (e) => {
        setPassword(e.target.value)
    }

    return <GeneralContext.Provider value={{
        name,changeName, password, changePassword
    }}>
        {children}
    </GeneralContext.Provider>
}

export default GeneralContext