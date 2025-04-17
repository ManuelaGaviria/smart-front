import LogoutButton from "../../../../components/LogoutButton";
import Logo2 from "../../../../components/Logo2";
import { motion } from 'framer-motion';
import ButtonLink from "../../../../components/ButtonLink";
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useContext } from 'react';
import { fetchBody } from "../../../../utils/fetch";
import Swal from 'sweetalert2';
import Button from "../../../../components/Button";
import ButtonLinkState from "../../../../components/ButtonLinkState";

function ExamenEscrito() {
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

  const [examenesSelect, setExamenSelect] = useState([]);

  useEffect(() => {
    const obtenerExamenes = async () => {
      try {
        const respuesta = await fetchBody('/niveles/obtenerExamen', 'POST', { nivel: "A1" });
        if (respuesta.exito) {
          const examenesFormateados = respuesta.lista;
          console.log("holi");
          console.log(examenesFormateados);
          setExamenSelect(examenesFormateados);
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: respuesta.error,
            customClass: {
              confirmButton: 'btn-color'
            },
            buttonsStyling: false
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: 'Error al procesar la solicitud para listar los examenes',
          customClass: {
            confirmButton: 'btn-color'
          },
          buttonsStyling: false
        });
      }
    }
    obtenerExamenes();
  }, []);

  async function accederExamen(id) {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Token no encontrado. Por favor, inicia sesión nuevamente.",
          customClass: {
            confirmButton: 'btn-color'
          },
          buttonsStyling: false
        });
        return;
      }

      const payload = JSON.parse(atob(token.split('.')[1]));
      const idUsuario = payload.id;

      // 🔍 Verificar si puede presentar según promedio + solicitud
      const verificacion = await verificarExamenPresentado(idUsuario, id);

      if (!verificacion) {
        return;
      }

      // 🔓 Verificar el estado del examen (por progreso de clases)
      const estadoValido = await verificarEstadoExamen(idUsuario, id);
      if (!estadoValido) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Aún no puedes presentar este examen porque no has visto todas las clases para desbloquearlo.",
          customClass: {
            confirmButton: 'btn-color'
          },
          buttonsStyling: false
        });
        return;
      }

      // ✅ Mostrar confirmación
      const resultado = await Swal.fire({
        title: "¿Estás seguro de presentar el examen?",
        text: "Una vez entres deberás completarlo.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, presentar",
        cancelButtonText: "Cancelar",
        customClass: {
          confirmButton: 'btn-color',
          cancelButton: 'btn-color-cancel'
        },
        buttonsStyling: false
      });

      if (resultado.isConfirmed) {
        navigate('/NavPage', { state: { examenId: id } });
      }
    } catch (error) {
      console.error("Error en accederExamen:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al intentar acceder al examen.",
        customClass: {
          confirmButton: 'btn-color'
        },
        buttonsStyling: false
      });
    }
  }

  // Función para verificar si el examen ya fue presentado
  async function verificarExamenPresentado(idUsuario, idExamen) {
    try {
      const respuesta = await fetchBody('/estudiantes/verificarPresentado', 'POST', {
        idEstudiante: idUsuario,
        examenId: idExamen,
        nivel: 'A1'
      });

      if (respuesta.exito) {
        // Si puede presentar, devolvemos true
        if (respuesta.puedePresentar) {
          return true;
        }
        // Si no puede, mostramos alerta personalizada según la razón
        switch (respuesta.razon) {
          case 'nota-suficiente':
            Swal.fire({
              icon: 'info',
              title: 'Examen ya aprobado',
              text: 'Ya obtuviste una nota igual o mayor a 4.0. No necesitas volver a presentarlo.',
              customClass: { confirmButton: 'btn-color' },
              buttonsStyling: false
            });
            break;

          case 'pendiente':
            Swal.fire({
              icon: 'info',
              title: 'Solicitud pendiente',
              text: 'Tu solicitud para repetir el examen está pendiente. Espera la aprobación del administrador.',
              customClass: { confirmButton: 'btn-color' },
              buttonsStyling: false
            });
            break;

          case 'rechazado':
            Swal.fire({
              icon: 'warning',
              title: 'Solicitud rechazada',
              text: 'Tu solicitud fue rechazada. Debes enviar una nueva solicitud si deseas repetir el examen.',
              customClass: { confirmButton: 'btn-color' },
              buttonsStyling: false
            });
            break;

          case 'ya-tiene-intento':
            Swal.fire({
              icon: 'warning',
              title: 'Ya presentaste',
              text: 'Debes presentar el examen oral o hacer una solicitud de intento.',
              customClass: { confirmButton: 'btn-color' },
              buttonsStyling: false
            });
            break;

          case 'no-hay-solicitud':
            Swal.fire({
              icon: 'info',
              title: 'Sin solicitud',
              text: 'Debes enviar una solicitud para poder volver a presentar el examen.',
              customClass: { confirmButton: 'btn-color' },
              buttonsStyling: false
            });
            break;
          case 'estado-desconocido':
            Swal.fire({
              icon: 'info',
              title: 'Sin solicitud',
              text: 'Debes enviar una solicitud para poder volver a presentar el examen.',
              customClass: { confirmButton: 'btn-color' },
              buttonsStyling: false
            });
            break;
          default:
            break;
        }
        return false;
      } else {
        throw new Error(respuesta.error || "Error al verificar si el examen fue presentado.");
      }
    } catch (error) {
      console.error("Error en verificarExamenPresentado:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al verificar el estado del examen.',
        customClass: { confirmButton: 'btn-color' },
        buttonsStyling: false
      });
      return false;
    }
  }

  // Función para verificar el estado del examen
  async function verificarEstadoExamen(idUsuario, idExamen) {
    try {
      const respuesta = await fetchBody('/estudiantes/obtenerEstado', 'POST', { id: idUsuario, examen: idExamen, nivel: 'A1' });
      console.log(respuesta);
      if (respuesta.exito) {
        return respuesta.estado === "tomado"; // Validar si el estado permite tomar el examen
      } else {
        throw new Error(respuesta.error || "Error al verificar el estado del examen.");
      }
    } catch (error) {
      console.error("Error en verificarEstadoExamen:", error);
      return false;
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
          <h1>Examen Escrito A1</h1>
          <p>Selecciona el examen a realizar</p>
          <div className=''>
            {examenesSelect.map((examen, index) => (
              <button className='circleLevelsExamen' onClick={() => accederExamen(examen.id)}>{examen.id}</button>
            ))}
            <br />
            <br />
            <ButtonLink destino="/A1" clase="Button2">Regresar</ButtonLink>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ExamenEscrito