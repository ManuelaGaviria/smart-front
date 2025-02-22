import React from 'react'
import Page2Button from '../../../../components/Page2Button'

function GestionarA1() {
  return (
    <Page2Button titulo="Gestionar A1"
        tituloBoton1="Gestionar Clases"
        destinoBoton1="/VerClasesA1"
        tituloBoton2="Gestionar Examenes"
        destinoBoton2="/GestionarExamenA1"
        destinoRegreso="/GestionarNiveles"
    >
    </Page2Button>
  )
}

export default GestionarA1