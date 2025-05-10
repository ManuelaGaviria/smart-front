import React, { useEffect, useState, useContext } from 'react';
import Logo2 from '../../components/Logo2';
import { motion } from 'framer-motion';
import LogoutButton from '../../components/LogoutButton';
import { fetchBody } from '../../utils/fetch';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import ContenedorForms from '../../components/ContenedorForms';
import LabelInputIcon from '../../components/LabelInputIcon';
import GeneralContext from '../../context/GeneralContext';
import Swal from 'sweetalert2';
import ButtonLink from '../../components/ButtonLink';
import { FiHelpCircle } from "react-icons/fi";

const nivelesOrden = ['A1', 'A2', 'B1', 'B2', 'C1'];

function Student() {
  const navigate = useNavigate();
  const [idUsuario, setIdUsuario] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [backgroundOpacity] = useState(1.5);
  const { password, changePassword, confirmationPassword, changeConfirmationPassword } = useContext(GeneralContext);

  useEffect(() => {
    const verificar = async () => {
      const respuesta = await fetchBody('/usuarios/', 'POST', { rol: "estudiante" });
      if (respuesta.exito === false) {
        navigate("/");
      }
    };

    const obtenerId = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setIdUsuario(payload.id);
      }
    };

    verificar();
    obtenerId();
  }, []);

  const validateLevel = async () => {
    try {
      if (!idUsuario) return;

      // 1. Obtener nivel actual
      const nivelActualResp = await fetchBody('/estudiantes/nivelActual', 'POST', { id: idUsuario });

      if (!nivelActualResp.exito) throw new Error("No se pudo obtener el nivel actual");

      const nivelActual = nivelActualResp.nivelActual;

      // 2. Verificar si lo culminó
      const finalizadoResp = await fetchBody('/estudiantes/validarNivelFinalizado', 'POST', {
        idEstudiante: idUsuario,
        nivel: nivelActual
      });

      if (!finalizadoResp.finalizado) {
        // Si no ha terminado, redirigir al nivel actual
        navigate(`/${nivelActual}`);
        return;
      }

      // 3. Obtener lista de niveles matriculados
      const nivelesResp = await fetchBody('/estudiantes/nivelesMatriculados', 'POST', { idEstudiante: idUsuario });

      if (!nivelesResp.exito) throw new Error("Error al obtener los niveles matriculados");

      const nivelesMatriculados = nivelesResp.niveles;

      // 4. Verificar cuál sigue
      const indexActual = nivelesOrden.indexOf(nivelActual);
      const siguienteNivel = nivelesOrden[indexActual + 1];

      // 4. Actualizar nivelActual en Firebase
      const actualizarNivel = await fetchBody('/estudiantes/actualizarNivelActual', 'POST', {
        idEstudiante: idUsuario,
        nuevoNivel: siguienteNivel
      });

      if (actualizarNivel) {
        const nivelActualizado = await fetchBody('/estudiantes/nivelActual', 'POST', { id: idUsuario });

        if (nivelActualizado && nivelesMatriculados.includes(siguienteNivel)) {
          navigate(`/${nivelActualizado}`);
        }
      }

      if (siguienteNivel && nivelesMatriculados.includes(siguienteNivel)) {
        navigate(`/${siguienteNivel}`);
      } else {
        Swal.fire({
          icon: "success",
          title: "¡Felicidades!",
          text: "Has culminado todos los niveles. Puedes revisar tu histórico en 'Niveles Culminados'.",
          customClass: { confirmButton: 'btn-color' },
          buttonsStyling: false
        });
      }
    } catch (error) {
      console.error("Error en validación del nivel actual:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Error al validar tu nivel actual",
        customClass: { confirmButton: 'btn-color' },
        buttonsStyling: false
      });
    }
  };

  const closeModal = () => {
    setShowPasswordModal(false);
  };

  async function changePass() {
    if (password === "" || confirmationPassword === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Debes llenar todos los campos",
        customClass: { confirmButton: 'btn-color' },
        buttonsStyling: false
      });
    } else {
      if (password !== confirmationPassword) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Las contraseñas no coinciden",
          customClass: { confirmButton: 'btn-color' },
          buttonsStyling: false
        });
      } else {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password) || !passwordRegex.test(confirmationPassword)) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "La contraseña debe tener al menos 8 caracteres y contener al menos una mayúscula, una minúscula y un número",
            customClass: { confirmButton: 'btn-color' },
            buttonsStyling: false
          });
        } else {
          try {
            const token = localStorage.getItem("token");

            if (token) {
              const payload = JSON.parse(atob(token.split('.')[1]));
              const idUsuario = payload.id;
              const rolUsuario = payload.rol;

              const data = {
                id: idUsuario,
                newPassword: password,
                rol: rolUsuario
              };

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
                setShowPasswordModal(false);
              }
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
      initial={{ opacity: 0, x: 1000 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -1000 }}
      transition={{ duration: 1 }}
    >
      <button
        className="helpButton"
        onClick={() => window.location.href = 'https://drive.google.com/file/d/1d-oRYbOAmw8nZneOcWBZbjFkFckOKAAa/view?usp=drive_link'}
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
          <h1>Bienvenido Estudiante</h1>
          <div>
            <Button eventoClick={validateLevel} clase="Button2">Nivel Actual</Button>
            <ButtonLink destino="/NivelesCulminados" clase="Button2">Niveles Culminados</ButtonLink>
          </div>
        </div>
      </motion.div>

      {showPasswordModal && (
        <>
          <div className="BackgroundOverlay" style={{ opacity: backgroundOpacity }} />
          <ContenedorForms>
            <span className="close" onClick={closeModal}>&times;</span>
            <h1>Cambiar Contraseña</h1>
            <div className="InputContainer">
              <LabelInputIcon eventoCambio={changePassword} texto="Nueva contraseña" />
              <LabelInputIcon eventoCambio={changeConfirmationPassword} texto="Confirmar contraseña" />
            </div>
            <br />
            <Button clase="Button" eventoClick={changePass}>Cambiar Contraseña</Button>
          </ContenedorForms>
        </>
      )}
    </motion.div>
  );
}

export default Student;