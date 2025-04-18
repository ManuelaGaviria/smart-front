import React from 'react'
import Page2Button from '../../../../components/Page2Button'

function GestionarA2() {
  return (
    <Page2Button titulo="Gestionar A2"
        tituloBoton1="Gestionar Clases"
        destinoBoton1="/VerClasesA2"
        tituloBoton2="Gestionar Examenes"
        destinoBoton2="/GestionarExamenA2"
        destinoRegreso="/GestionarNiveles"
    >
    </Page2Button>
  )
}

export default GestionarA2