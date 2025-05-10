import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBody } from '../../../../utils/fetch';
import Page2Button from '../../../../components/Page2Button'

function GestionarExamenB1() {
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