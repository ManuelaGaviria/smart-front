import Logo2 from './Logo2';
import { motion} from 'framer-motion';
import { FaChalkboardTeacher } from "react-icons/fa";
import CircleImage from './CircleImage';
import ButtonLink from './ButtonLink';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBody } from '../utils/fetch';

function Page2Button({titulo, tituloBoton1, tituloBoton2, destinoBoton1, destinoBoton2, destinoRegreso, children}) {
  const navigate = useNavigate();
    useEffect(() => {
        const verificar = async () => {
            const respuesta = await fetchBody('/usuarios/', 'POST', {rol: "superadministrador"});
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
      <CircleImage icon={FaChalkboardTeacher}></CircleImage>
      <div className='logoAdminContainer'>
        <Logo2></Logo2>
      </div>
      <motion.div
      className='contentAdminContainer'
      initial={{ opacity: 0, y: -500 }} // Inicia desde abajo (puedes ajustar la distancia según tus necesidades)
      animate={{ opacity: 1, y: -50 }} // Animación de arriba hacia abajo
      exit={{ opacity: 0, y: 500 }} // Sale hacia abajo
      transition={{ duration: 2 }}
      > 
        <div className='ButtonsAdminContainer'>
          <h1 className='tituloPrincipal'>{titulo}</h1>
          <div className='ButtonContainer'>
            <ButtonLink destino={destinoBoton1} clase="Button2">{tituloBoton1}</ButtonLink>
            <ButtonLink destino={destinoBoton2} clase="Button2">{tituloBoton2}</ButtonLink>
            {children}
            <ButtonLink destino={destinoRegreso} clase="Button2">Regresar</ButtonLink>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Page2Button