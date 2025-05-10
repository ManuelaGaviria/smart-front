import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBody } from '../../../../utils/fetch';
import Page2Button from '../../../../components/Page2Button'

function GestionarC1() {
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