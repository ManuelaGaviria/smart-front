import LogoutButton from "../../../../components/LogoutButton";
import Logo2 from "../../../../components/Logo2";
import { motion} from 'framer-motion';
import ButtonLink from "../../../../components/ButtonLink";
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useContext } from 'react';
import { fetchBody } from "../../../../utils/fetch";

function C1() {
  const navigate = useNavigate();
  useEffect(() => {
    const verificar = async () => {
      const respuesta = await fetchBody('/usuarios/', 'POST', { rol: "estudiante" });
      if (respuesta.exito === false) {
        navigate("/")
      }
    }
    verificar();
  }, [])

  return (
    <motion.div 
    className='AdminContainer'
    initial={{ opacity: 0, x: 1000 }} // Inicia desde la derecha
    animate={{ opacity: 1, x: 0 }} // Animación hacia la izquierda
    exit={{ opacity: 0, x: -1000 }} // Sale hacia la izquierda
    transition={{ duration: 1 }}>
      <LogoutButton></LogoutButton>
      <div className='logoAdminContainer'>
        <Logo2></Logo2>
      </div>
      <motion.div
      className='contentAdminContainer'
      initial={{ opacity: 0, y: -500 }} // Inicia desde abajo (puedes ajustar la distancia según tus necesidades)
      animate={{ opacity: 1, y: -50 }} // Animación de arriba hacia abajo
      exit={{ opacity: 0, y: 500 }} // Sale hacia abajo
      transition={{ duration: 1 }}
      > 
        <div className='ButtonsAdminContainer'>
          <h1>Nivel C1</h1>
          <div className=''>
            <ButtonLink destino="/ProgramarC1" clase="Button2">Programar</ButtonLink>
            <ButtonLink destino="/ExamenEscritoC1" clase="Button2">Realizar examen</ButtonLink>
            <ButtonLink destino="/NotasC1" clase="Button2">Ver notas</ButtonLink>
            <ButtonLink destino="https://www.cambridgeone.org/login" clase="Button2">Ir a cambridge</ButtonLink>
            <ButtonLink destino="/Student" clase="Button2">Regresar</ButtonLink>
          </div>
        </div> 
      </motion.div>
    </motion.div>
  )
}

export default C1