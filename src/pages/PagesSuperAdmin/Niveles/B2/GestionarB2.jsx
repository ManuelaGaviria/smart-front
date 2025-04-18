import React from 'react'
import Page2Button from '../../../../components/Page2Button'

function GestionarB2() {
  return (
    <Page2Button titulo="Gestionar B2"
        tituloBoton1="Gestionar Clases"
        destinoBoton1="/VerClasesB2"
        tituloBoton2="Gestionar Examenes"
        destinoBoton2="/GestionarExamenB2"
        destinoRegreso="/GestionarNiveles"
    >
    </Page2Button>
  )
}

export default GestionarB2