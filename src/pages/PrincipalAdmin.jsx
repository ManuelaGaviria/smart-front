import React, { useEffect, useState } from 'react'
import Logo2 from '../components/Logo2';
import { motion } from 'framer-motion';
import ImageButton from '../components/ImageButton';
import { FaChalkboardTeacher } from "react-icons/fa";
import { PiStudentBold } from "react-icons/pi";
import LogoutButton from '../components/LogoutButton';
import { fetchBody } from '../utils/fetch';
import { useNavigate } from 'react-router-dom';
import { MdOutlineCallMade } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { TbReportAnalytics } from "react-icons/tb";
import { FiHelpCircle } from "react-icons/fi";

function PrincipalAdmin() {
  const navigate = useNavigate();
  const [notificaciones, setNotificaciones] = useState(0);

  useEffect(() => {
    const verificar = async () => {
      const respuesta = await fetchBody('/usuarios/', 'POST', { rol: "administrador" });
      if (respuesta.exito === false) {
        navigate("/")
      }
    };
    verificar();
  }, []);

  // Obtener el número de solicitudes pendientes
  useEffect(() => {
    const obtenerSolicitudesPendientes = async () => {
      try {
        const respuesta = await fetchBody('/solicitudes/obtenerSolicitudesPendientes', 'GET');
        if (respuesta.exito) {
          setNotificaciones(respuesta.cantidad || 0);
        }
      } catch (error) {
        console.error("Error al obtener solicitudes pendientes:", error);
      }
    };
    obtenerSolicitudesPendientes();
  }, []);

  return (
    <motion.div
      className='AdminContainer'
      initial={{ opacity: 0, x: 1000 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -1000 }}
      transition={{ duration: 2 }}>
      <button
        className="helpButton"
        onClick={() => window.location.href = 'https://drive.google.com/file/d/1i5pgaslplUdF-ELGlIz_Z5tWp2hVOEW6/view?usp=sharing'}
        aria-label="Ayuda"
      >
        <FiHelpCircle size={40} />
      </button>
      <LogoutButton />
      <div className='logoAdminContainer'>
        <Logo2 />
      </div>
      <motion.div
        className='contentAdminContainer'
        initial={{ opacity: 0, y: -500 }}
        animate={{ opacity: 1, y: -50 }}
        exit={{ opacity: 0, y: 500 }}
        transition={{ duration: 1 }}
      >
        <div className='ButtonsAdminContainer'>
          <div className=''>
            <button className='notificationButton' onClick={() => navigate('/Solicitudes')}>
              <IoMdNotificationsOutline size={24} />
              Notificaciones
              {notificaciones > 0 && (
                <span className='notificationBadge'>{notificaciones}</span>
              )}
            </button>
          </div>
          <h1 className='tituloAdmin'>Bienvenido Administrador</h1>
          <div>
            <ImageButton icon={FaChalkboardTeacher} texto="Gestionar Profesores" destino="/PrincipalTeacher" />
            <ImageButton icon={PiStudentBold} texto="Gestionar Estudiantes" destino="/PrincipalStudent" />
            <ImageButton icon={MdOutlineCallMade} texto="Gestionar Solicitudes" destino="/GestionarSolicitudes" />
            <ImageButton icon={TbReportAnalytics} texto="Reportes" destino="/Reportes" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default PrincipalAdmin;