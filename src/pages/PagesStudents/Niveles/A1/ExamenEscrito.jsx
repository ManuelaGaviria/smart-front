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
    const token = localStorage.getItem("token");

    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const idUsuario = payload.id;
      // Validar que el examen seleccionado si lo pueda agendar
      const respuestaExamenesProgramados = await fetchBody('/estudiantes/obtenerEstado', 'POST', { id: idUsuario, examen: id, nivel: 'A1' });
      if (respuestaExamenesProgramados.exito) {

        const estado = respuestaExamenesProgramados.estado;


        if (estado !== "tomado") {

          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Aún no puedes presentar este examen porque no has visto todas las clases para desbloquearlo",
            customClass: {
              confirmButton: 'btn-color'
            },
            buttonsStyling: false
          });
          return;
        } else {
          navigate('/NavPage', { state: { examenId: id } });
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