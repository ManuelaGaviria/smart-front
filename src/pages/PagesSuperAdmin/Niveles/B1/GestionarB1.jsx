import React from 'react'
import Page2Button from '../../../../components/Page2Button'

function GestionarB1() {
  return (
    <Page2Button titulo="Gestionar B1"
        tituloBoton1="Gestionar Clases"
        destinoBoton1="/VerClasesB1"
        tituloBoton2="Gestionar Examenes"
        destinoBoton2="/GestionarExamenB1"
        destinoRegreso="/GestionarNiveles"
    >
    </Page2Button>
  )
}

export default GestionarB1