import React from 'react'
import Page2Button from '../../../../components/Page2Button'

function GestionarExamenA1() {
  return (
    <Page2Button titulo="Gestionar Examenes A1"
    tituloBoton1="Crear examen"
    destinoBoton1="/CrearExamenA1"
    tituloBoton2="Ver Examenes"
    destinoBoton2="/VerExamenA1"
    destinoRegreso="/GestionarA1"
    >
    </Page2Button>
  )
}

export default GestionarExamenA1