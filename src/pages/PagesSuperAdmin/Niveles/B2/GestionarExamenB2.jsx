import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBody } from '../../../../utils/fetch';
import Page2Button from '../../../../components/Page2Button'

function GestionarExamenB2() {
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