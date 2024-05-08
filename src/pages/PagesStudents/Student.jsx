import React, { useEffect, useState } from 'react'
import Logo2 from '../../components/Logo2';
import { motion} from 'framer-motion';
import ImageButton from '../../components/ImageButton';
import { FaChalkboardTeacher } from "react-icons/fa";
import { PiStudentBold } from "react-icons/pi";
import LogoutButton from '../../components/LogoutButton';
import { fetchBody } from '../../utils/fetch';
import { useNavigate } from 'react-router-dom';
import LabelInput from '../../components/LabelInput';
import Button from '../../components/Button';
import ContenedorForms from '../../components/ContenedorForms';

function Student() {
    const navigate = useNavigate();
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [backgroundOpacity] = useState(1.5);

    useEffect(() => {
        const verificar = async () => {
            const respuesta = await fetchBody('/usuarios/', 'POST', {rol: "estudiante"});
            if (respuesta.exito === false) {
                navigate("/")
            } else {
              if (respuesta.status) {
                  setShowPasswordModal(true);
              }
          }
        }
        verificar();
    }, [])

    const closeModal = () => {
      setShowPasswordModal(false);
    }

  return (
    <motion.div 
    className='AdminContainer'
    initial={{ opacity: 0, x: 1000 }} // Inicia desde la derecha
    animate={{ opacity: 1, x: 0 }} // Animación hacia la izquierda
    exit={{ opacity: 0, x: -1000 }} // Sale hacia la izquierda
    transition={{ duration: 2 }}>
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
          <h1>Bienvenido Estudiante</h1>
          <div className=''>
            <ImageButton icon={FaChalkboardTeacher} texto="Programar Clase" destino="/PrincipalTeacher"></ImageButton>
            <ImageButton icon={PiStudentBold} texto="Tomar Examen" destino="/PrincipalStudent"></ImageButton>
          </div>
        </div> 
      </motion.div>
      {showPasswordModal && (
      <>
        <div
          className="BackgroundOverlay"
          style={{ opacity: backgroundOpacity }}
        />
        <ContenedorForms>
          <span className="close" onClick={closeModal}>&times;</span>
          <h1>Cambiar Contraseña</h1>
          <div className="InputContainer">
            <LabelInput id="studentName" texto="Nombre"></LabelInput>
            
          </div>
          <br />
          <Button clase="Button">Cambiar Contraseña</Button>
        </ContenedorForms>
      </>
    )}
    </motion.div>
  )
}

export default Student