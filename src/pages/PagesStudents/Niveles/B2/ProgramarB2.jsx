import Logo2 from "../../../../components/Logo2";
import { motion} from 'framer-motion';
import { MdOutlineClass } from "react-icons/md";
import { SiTestcafe } from "react-icons/si";
import ImageButton from "../../../../components/ImageButton";
import ButtonLink from "../../../../components/ButtonLink";
import { FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useContext } from 'react';
import { fetchBody } from "../../../../utils/fetch";

function ProgramarB2() {
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
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <h1>Programación</h1>
          <div className=''>
            <ImageButton icon={MdOutlineClass} texto="Programar clases" destino="/ProgramarClaseB2"></ImageButton>
            <ImageButton icon={SiTestcafe} texto="Programar examen" destino="/ProgramarExamenB2"></ImageButton>
            <br></br>
            <br></br>
            <ButtonLink destino="/B2" clase="Button2">Regresar</ButtonLink>
          </div>
        </div> 
      </motion.div>
    </motion.div>
  )
}

export default ProgramarB2