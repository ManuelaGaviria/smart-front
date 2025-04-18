import React from 'react'
import Page2Button from '../../../../components/Page2Button'

function GestionarExamenA2() {
  return (
    <Page2Button titulo="Gestionar Examenes A2"
    tituloBoton1="Crear examen"
    destinoBoton1="/CrearExamenA2"
    tituloBoton2="Ver Examenes"
    destinoBoton2="/VerExamenA2"
    destinoRegreso="/GestionarA2"
    >
    </Page2Button>
  )
}

export default GestionarExamenA2