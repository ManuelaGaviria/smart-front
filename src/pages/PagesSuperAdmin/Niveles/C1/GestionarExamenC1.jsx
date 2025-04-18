import React from 'react'
import Page2Button from '../../../../components/Page2Button'

function GestionarExamenC1() {
  return (
    <Page2Button titulo="Gestionar Examenes C1"
    tituloBoton1="Crear examen"
    destinoBoton1="/CrearExamenC1"
    tituloBoton2="Ver Examenes"
    destinoBoton2="/VerExamenC1"
    destinoRegreso="/GestionarC1"
    >
    </Page2Button>
  )
}

export default GestionarExamenC1