import React, { useEffect, useState, useContext } from 'react'
import Logo2 from '../../components/Logo2';
import { motion } from 'framer-motion';
import LogoutButton from '../../components/LogoutButton';
import { fetchBody, fetchGet } from '../../utils/fetch';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import ContenedorForms from '../../components/ContenedorForms';
import LabelInputIcon from '../../components/LabelInputIcon';
import GeneralContext from '../../context/GeneralContext';
import Swal from 'sweetalert2';
import ButtonLink from '../../components/ButtonLink';

function Student() {
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

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [backgroundOpacity] = useState(1.5);
  const { password, changePassword, confirmationPassword, changeConfirmationPassword } = useContext(GeneralContext);


  useEffect(() => {
    const verificar = async () => {
      const respuesta = await fetchBody('/usuarios/', 'POST', { rol: "estudiante" });
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

  async function validateLevel() {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        // Decodificar el payload del token (segundo segmento)
        const payload = JSON.parse(atob(token.split('.')[1]));

        // Acceder al id y rol del usuario
        const idUsuario = payload.id;

        console.log(`ID del usuario: ${idUsuario}`);

        const data = {
          id: idUsuario
        }

        const respuesta = await fetchBody('/estudiantes/nivelActual', 'POST', data);

        if (respuesta.exito) {
          switch (respuesta.nivelActual) {
            case 'A1':
              navigate('/A1');
              break;
            case 'A2':
              navigate('/A2');
              break;
            case 'B1':
              navigate('/B1');
              break;
            case 'B2':
              navigate('/B2');
              break;
            case 'C1':
              navigate('/C1');
              break;
            default:
              console.error('Nivel desconocido:', respuesta.nivelActual);
              Swal.fire({
                icon: "error",
                title: "Error",
                text: 'Error al navegar al nivel actual del estudiante',
                customClass: {
                  confirmButton: 'btn-color'
                },
                buttonsStyling: false
              });
              navigate('/Student');
              break;
          }
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: 'Error al obtener el nivel actual del estudiante',
        customClass: {
          confirmButton: 'btn-color'
        },
        buttonsStyling: false
      });
    }
  }

  async function changePass() {
    if (password === "" || confirmationPassword === "") {
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
          <h1>Bienvenido Estudiante</h1>
          <div className=''>
            <Button eventoClick={validateLevel} clase="Button2">Nivel Actual</Button>
            <ButtonLink destino="/NivelesCulminados" clase="Button2">Niveles Culminados</ButtonLink>
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

export default Student