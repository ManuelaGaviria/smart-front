import React from 'react'
import Page2Button from '../../../../components/Page2Button'

function GestionarClaseA1() {
  return (
    <Page2Button titulo="Gestionar Clases A1"
    tituloBoton1="Crear clase"
    destinoBoton1="/CrearClaseA1"
    tituloBoton2="Ver Clases"
    destinoBoton2="/VerClasesA1"
    destinoRegreso="/GestionarA1"
    ></Page2Button>
  )
}

export default GestionarClaseA1