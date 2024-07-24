import React, { useEffect } from 'react'
import Logo2 from '../../components/Logo2';
import { motion} from 'framer-motion';
import LogoutButton from '../../components/LogoutButton';
import { fetchBody } from '../../utils/fetch';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import ContenedorForms from '../../components/ContenedorForms';
import LabelInputIcon from '../../components/LabelInputIcon';
import ButtonLink from '../../components/ButtonLink';

function NivelesCukinados() {
  const navigate = useNavigate();
    useEffect(() => {
        const verificar = async () => {
            const respuesta = await fetchBody('/usuarios/', 'POST', {rol: "estudiante"});
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
          <h1>Niveles Culminados</h1>
          <p>Selecciona el nivel</p>
          <div className=''>
            <ButtonLink destino="/GestionarA1" clase="circleLevels">A1</ButtonLink>
            <ButtonLink destino="/GestionarA2" clase="circleLevels">A2</ButtonLink>
            <ButtonLink destino="/GestionarB1" clase="circleLevels">B1</ButtonLink>
            <ButtonLink destino="/GestionarB2" clase="circleLevels">B2</ButtonLink>
            <ButtonLink destino="/GestionarC1" clase="circleLevels">C1</ButtonLink>
          </div>
          <br></br>
          <ButtonLink destino="/Student" clase="Button2">Regresar</ButtonLink>
        </div> 
      </motion.div>
    </motion.div>
  )
}

export default NivelesCukinados