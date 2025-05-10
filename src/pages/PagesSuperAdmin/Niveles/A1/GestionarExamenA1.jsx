import Page2Button from '../../../../components/Page2Button'
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBody } from '../../../../utils/fetch';

function GestionarExamenA1() {
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