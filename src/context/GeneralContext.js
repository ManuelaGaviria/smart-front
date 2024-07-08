import { createContext, useState } from "react";

const GeneralContext = createContext()

export const GeneralProvider = ({children}) => {

    const [password, setPassword] = useState("")
    const changePassword = (e) => {
        setPassword(e.target.value)
    }

    const [confirmationPassword, setConfirmationPassword] = useState("")
    const changeConfirmationPassword = (e) => {
        setConfirmationPassword(e.target.value)
    }

    const [name, setName] = useState("")
    const changeName = (e) => {
        setName(e.target.value)
    }

    const [apellido, setApellido] = useState("")
    const changeApellido = (e) => {
        setApellido(e.target.value)
    }

    const [tipoDocumento, setTipoDocumento] = useState("")
    const changeTipoDocumento = (e) => {
        setTipoDocumento(e.target.value)
    }

    const [documento, setDocumento] = useState("")
    const changeDocumento = (e) => {
        setDocumento(e.target.value)
    }

    const [correo, setCorreo] = useState("")
    const changeCorreo = (e) => {
        setCorreo(e.target.value)
    }

    const [genero, setGenero] = useState("")
    const changeGenero = (e) => {
        setGenero(e.target.value)
    }

    const [nacimiento, setNacimiento] = useState("")
    const changeNacimiento = (e) => {
        setNacimiento(e.target.value)
    }

    const [niveles, setNiveles] = useState([])
    const changeNiveles = (e) => {
        setNiveles(e.target.value)
    }

    const [administrador, setAdministrador] = useState([])
    const changeAdministrador = (e) => {
        setAdministrador(e.target.value)
    }

    const [numero, setNumero] = useState([])
    const changeNumero = (e) => {
        setNumero(e.target.value)
    }

    const [descripcion, setDescripcion] = useState([])
    const changeDescripcion = (e) => {
        setDescripcion(e.target.value)
    }

    return <GeneralContext.Provider value={{
        name,changeName, 
        apellido, changeApellido,
        tipoDocumento, changeTipoDocumento,
        documento, changeDocumento, 
        correo, changeCorreo, 
        genero, changeGenero,
        nacimiento, changeNacimiento, 
        password, changePassword,
        niveles, changeNiveles,
        confirmationPassword, changeConfirmationPassword,
        administrador, changeAdministrador,
        numero, changeNumero,
        descripcion, changeDescripcion
    }}>
        {children}
    </GeneralContext.Provider>
}

export default GeneralContext