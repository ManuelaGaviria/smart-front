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
          console.log(respuesta);
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
          <div className='headerContainer'>
            <button className='notificationButton' onClick={() => navigate('/notificaciones')}>
              <IoMdNotificationsOutline size={24} />
              Notificaciones
              {notificaciones > 0 && (
                <span className='notificationBadge'>{notificaciones}</span>
              )}
            </button>
          </div>
          <h1>Bienvenido Administrador</h1>
          <div>
            <ImageButton icon={FaChalkboardTeacher} texto="Gestionar Profesores" destino="/PrincipalTeacher" />
            <ImageButton icon={PiStudentBold} texto="Gestionar Estudiantes" destino="/PrincipalStudent" />
            <ImageButton icon={MdOutlineCallMade} texto="Gestionar Solicitudes" destino="/PrincipalSolicitud" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default PrincipalAdmin;