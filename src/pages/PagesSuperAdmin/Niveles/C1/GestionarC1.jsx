import React from 'react'
import Page2Button from '../../../../components/Page2Button'

function GestionarC1() {
  return (
    <Page2Button titulo="Gestionar C1"
        tituloBoton1="Gestionar Clases"
        destinoBoton1="/VerClasesC1"
        tituloBoton2="Gestionar Examenes"
        destinoBoton2="/GestionarExamenC1"
        destinoRegreso="/GestionarNiveles"
    >
    </Page2Button>
  )
}

export default GestionarC1