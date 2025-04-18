import React from 'react'
import Page2Button from '../../../../components/Page2Button'

function GestionarExamenB1() {
  return (
    <Page2Button titulo="Gestionar Examenes B1"
    tituloBoton1="Crear examen"
    destinoBoton1="/CrearExamenB1"
    tituloBoton2="Ver Examenes"
    destinoBoton2="/VerExamenB1"
    destinoRegreso="/GestionarB1"
    >
    </Page2Button>
  )
}

export default GestionarExamenB1