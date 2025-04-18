import React from 'react'
import Page2Button from '../../../../components/Page2Button'

function GestionarExamenB2() {
  return (
    <Page2Button titulo="Gestionar Examenes B2"
    tituloBoton1="Crear examen"
    destinoBoton1="/CrearExamenB2"
    tituloBoton2="Ver Examenes"
    destinoBoton2="/VerExamenB2"
    destinoRegreso="/GestionarB2"
    >
    </Page2Button>
  )
}

export default GestionarExamenB2