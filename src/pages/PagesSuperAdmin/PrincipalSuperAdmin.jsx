import React, { useEffect } from 'react'
import Logo2 from '../../components/Logo2';
import { motion } from 'framer-motion';
import ImageButton from '../../components/ImageButton';
import { GrUserAdmin } from "react-icons/gr";
import { MdLibraryBooks } from "react-icons/md";
import LogoutButton from '../../components/LogoutButton';
import { fetchBody } from '../../utils/fetch';
import { useNavigate } from 'react-router-dom';
import { FiHelpCircle } from "react-icons/fi";

function PrincipalSuperAdmin() {
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
    <motion.div
      className='AdminContainer'
      initial={{ opacity: 0, x: 1000 }} // Inicia desde la derecha
      animate={{ opacity: 1, x: 0 }} // Animación hacia la izquierda
      exit={{ opacity: 0, x: -1000 }} // Sale hacia la izquierda
      transition={{ duration: 2 }}>
      <button
        className="helpButton"
        onClick={() => window.location.href = 'https://drive.google.com/file/d/17KeqNhMPD7FyMnNOnyDyTtsQKv9QWzFD/view?usp=drive_link'}
        aria-label="Ayuda"
      >
        <FiHelpCircle size={40} />
      </button>
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
          <h1>Bienvenido Administrador</h1>
          <div className=''>
            <ImageButton icon={GrUserAdmin} texto="Gestionar Administradores" destino="/GestionarAdmins"></ImageButton>
            <ImageButton icon={MdLibraryBooks} texto="Gestionar Niveles" destino="/GestionarNiveles"></ImageButton>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default PrincipalSuperAdmin