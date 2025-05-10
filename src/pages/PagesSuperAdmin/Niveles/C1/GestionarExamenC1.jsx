import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBody } from '../../../../utils/fetch';
import Page2Button from '../../../../components/Page2Button'

function GestionarExamenC1() {
  const navigate = useNavigate();
      useEffect(() => {
        const verificar = async () => {
          const respuesta = await fetchBody('/usuarios/', 'POST', { rol: "superadministrador" });
          if (respuesta.exito === false) {
            navigate("/")
          }
        }
        verificar();
      }, [])
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