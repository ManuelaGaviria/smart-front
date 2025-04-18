import React, { useEffect, useState } from 'react';
import Logo2 from '../../components/Logo2';
import { motion } from 'framer-motion';
import LogoutButton from '../../components/LogoutButton';
import { fetchBody } from '../../utils/fetch';
import { useNavigate } from 'react-router-dom';

function NivelesCulminados() {
  const navigate = useNavigate();
  const [nivelesMatriculados, setNivelesMatriculados] = useState([]);
  const [idEstudiante, setIdEstudiante] = useState(null);

  useEffect(() => {
    const verificar = async () => {
      const respuesta = await fetchBody('/usuarios/', 'POST', { rol: "estudiante" });
      if (respuesta.exito === false) {
        navigate("/");
      }
    };

    const obtenerNiveles = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const idEst = payload.id;
          setIdEstudiante(idEst);

          const respuesta = await fetchBody('/estudiantes/nivelesMatriculados', 'POST', { idEstudiante: idEst });
          if (respuesta.exito && Array.isArray(respuesta.niveles)) {
            setNivelesMatriculados(respuesta.niveles);
          } else {
            setNivelesMatriculados([]);
          }
        }
      } catch (error) {
        console.error("Error al traer niveles matriculados", error);
        setNivelesMatriculados([]);
      }
    };

    verificar();
    obtenerNiveles();
  }, [navigate]);

  const nivelesDisponibles = [
    { nivel: "A1", ruta: "/CulminarA1" },
    { nivel: "A2", ruta: "/CulminarA2" },
    { nivel: "B1", ruta: "/CulminarB1" },
    { nivel: "B2", ruta: "/CulminarB2" },
    { nivel: "C1", ruta: "/CulminarC1" },
  ];

  const manejarClickNivel = async (nivel, ruta) => {
    if (!idEstudiante) return;

    try {
      const respuesta = await fetchBody('/estudiantes/validarNivelFinalizado', 'POST', {
        idEstudiante: idEstudiante,
        nivel: nivel
      });

      if (respuesta.exito && respuesta.finalizado === true) {
        // Redirigir pasando nivel y id por state (alternativamente, puedes usar query params)
        navigate(ruta, { state: { nivel, idEstudiante } });
      } else {
        alert("Aún no has culminado este nivel. No hay datos disponibles en el histórico.");
      }

    } catch (error) {
      console.error("Error al verificar nivel:", error);
      alert("Hubo un error al verificar el nivel.");
    }
  };

  return (
    <motion.div
      className='AdminContainer'
      initial={{ opacity: 0, x: 1000 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -1000 }}
      transition={{ duration: 1 }}
    >
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
          <h1>Niveles Culminados</h1>
          <p>Selecciona el nivel</p>
          <div>
            {
              nivelesDisponibles.map(({ nivel, ruta }) =>
                nivelesMatriculados.includes(nivel) && (
                  <button
                    key={nivel}
                    className="circleLevels"
                    onClick={() => manejarClickNivel(nivel, ruta)}
                  >
                    {nivel}
                  </button>
                )
              )
            }
          </div>
          <br />
          <button className="Button2" onClick={() => navigate("/Student")}>Regresar</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default NivelesCulminados;