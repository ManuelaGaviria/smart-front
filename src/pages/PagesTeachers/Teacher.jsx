import React, { useEffect, useState, useContext } from 'react'
import Logo2 from '../../components/Logo2';
import { motion} from 'framer-motion';
import ImageButton from '../../components/ImageButton';
import { FaChalkboardTeacher } from "react-icons/fa";
import { PiStudentBold } from "react-icons/pi";
import LogoutButton from '../../components/LogoutButton';
import { fetchBody } from '../../utils/fetch';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import ContenedorForms from '../../components/ContenedorForms';
import GeneralContext from '../../context/GeneralContext';
import LabelInputIcon from '../../components/LabelInputIcon';
import Swal from 'sweetalert2';

function Teacher() {
    const navigate = useNavigate();
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [backgroundOpacity] = useState(1.5);
    const {password, changePassword, confirmationPassword, changeConfirmationPassword} = useContext (GeneralContext);

    useEffect(() => {
        const verificar = async () => {
            const respuesta = await fetchBody('/usuarios/', 'POST', {rol: "profesor"});
            if (respuesta.exito === false) {
                navigate("/")
            } else {
              console.log(respuesta);
              console.log(respuesta.status);
              if (respuesta.status) {
                  setShowPasswordModal(true);
              }
          }
        }
        verificar();
    }, [])

    async function changePass () {
      if (password==="" || confirmationPassword===""){
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Debes llenar todos los campos",
          customClass: {
            confirmButton: 'btn-color'
          },
          buttonsStyling: false
        });
      } else {
        if (password !== confirmationPassword) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Las contraseñas no coinciden",
            customClass: {
              confirmButton: 'btn-color'
            },
            buttonsStyling: false
          });
        } else {
          const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
          if (!passwordRegex.test(password) || !passwordRegex.test(confirmationPassword)) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "La contraseña debe tener al menos 8 caracteres y contener al menos una mayúscula, una minúscula y un número",
                customClass: {
                    confirmButton: 'btn-color'
                },
                buttonsStyling: false
            })
          } else {
            try {
              const token = localStorage.getItem("token");

              if (token) {
                  // Decodificar el payload del token (segundo segmento)
                  const payload = JSON.parse(atob(token.split('.')[1]));

                  // Acceder al id y rol del usuario
                  const idUsuario = payload.id;
                  const rolUsuario = payload.rol;

                  console.log(`ID del usuario: ${idUsuario}`);
                  console.log(`Rol del usuario: ${rolUsuario}`);

                  const data = {
                    id: idUsuario,
                    newPassword: password,
                    rol: rolUsuario
                  }        
                  console.log(data);     
                  const respuesta = await fetchBody('/usuarios/newPassword', 'PUT', data);
                  if (respuesta.exito) {
                    Swal.fire({
                      icon: "success",
                      title: "Contraseña cambiada con éxito!",
                      customClass: {
                        confirmButton: 'btn-color'
                      },
                      buttonsStyling: false
                    });
                  }
                  setShowPasswordModal(false);
              } else {
                  console.error("Token no encontrado en el localStorage");
              }
              
            } catch (error) {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: 'Error al procesar la solicitud para cambiar la contraseña',
                customClass: {
                  confirmButton: 'btn-color'
                },
                buttonsStyling: false
              });
            }

          }
        }
      }
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
          <h1>Bienvenido Profesor</h1>
          <div className=''>
            <ImageButton icon={FaChalkboardTeacher} texto="Ver programación" destino="/ProgramacionTeacher"></ImageButton>
            <ImageButton icon={PiStudentBold} texto="Calificar Examen" destino="/CalificarExamen"></ImageButton>
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
          <h1>Cambiar Contraseña</h1>
          <div className="InputContainer">
            <LabelInputIcon eventoCambio={changePassword} texto="Nueva contraseña"></LabelInputIcon>
            <LabelInputIcon eventoCambio={changeConfirmationPassword} texto="Confirmar contraseña"></LabelInputIcon>
          </div>
          <br />
          <Button clase="Button" eventoClick={changePass}>Cambiar Contraseña</Button>
        </ContenedorForms>
      </>
    )}
    </motion.div>
  )
}

export default Teacher