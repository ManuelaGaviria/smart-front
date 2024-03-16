import { createContext, useState } from "react";

const GeneralContext = createContext()

export const GeneralProvider = ({children}) => {

    const [name, setName] = useState("")
    const changeName = (e) => {
        setName(e.target.value)
    }

    const [document, setDocument] = useState("")
    const changeDocument = (e) => {
        setDocument(e.target.value)
    }

    const [correo, setCorreo] = useState("")
    const changeCorreo = (e) => {
        setCorreo(e.target.value)
    }

    const [nacimiento, setNacimiento] = useState("")
    const changeNacimiento = (e) => {
        setNacimiento(e.target.value)
    }

    return <GeneralContext.Provider value={{
        name,changeName, document, changeDocument, correo, changeCorreo, nacimiento, changeNacimiento
    }}>
        {children}
    </GeneralContext.Provider>
}

export default GeneralContext