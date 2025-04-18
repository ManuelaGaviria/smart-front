import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchBody } from '../../../utils/fetch';
import { motion } from 'framer-motion';
import Logo3 from '../../../components/Logo3';
import FullscreenCard from '../../../components/FullScreenCard';
import ButtonLink from '../../../components/ButtonLink';
import Swal from 'sweetalert2';

function CulminarA2() {
  const location = useLocation();
  const navigate = useNavigate();
  const { idEstudiante, nivel } = location.state || {};

  const [notas, setNotas] = useState([]);

  useEffect(() => {
      const verificar = async () => {
        const respuesta = await fetchBody('/usuarios/', 'POST', { rol: "estudiante" });
        if (respuesta.exito === false) {
          navigate("/")
        }
      }
      verificar();
    }, [])

  useEffect(() => {
    if (!idEstudiante || !nivel) {
      Swal.fire({
        icon: "error",
        title: "Datos faltantes",
        text: "No se pudo obtener la información del estudiante o nivel.",
        customClass: { confirmButton: 'btn-color' },
        buttonsStyling: false
      }).then(() => navigate('/'));
    } else {
      listNotas();
    }
  }, []);

  async function listNotas() {
    try {
      const respuesta = await fetchBody('/estudiantes/listarNotasExamen', 'POST', {
        idEstudiante,
        nivel
      });

      if (respuesta.exito) {
        console.log('respuesta.lista.notasExamenes :>> ', respuesta.lista.notasExamenes);
        const notasConPromedio = respuesta.lista.notasExamenes.map(examen => {
          const notaEscrito = parseFloat(examen.notaExamenEscrito) || 0;
          const notaOral = parseFloat(examen.notaExamenOral) || 0;
          const promedio = ((notaEscrito + notaOral) / 2).toFixed(2);

          return {
            ...examen,
            promedio
          };
        });

        setNotas(notasConPromedio);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: respuesta.error,
          customClass: { confirmButton: 'btn-color' },
          buttonsStyling: false
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al obtener las notas del examen",
        customClass: { confirmButton: 'btn-color' },
        buttonsStyling: false
      });
    }
  }

  return (
    <motion.div
      className='ContainerFull'
      initial={{ opacity: 0, x: 1000 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -1000 }}
      transition={{ duration: 1 }}
    >
      <Logo3 />
      <FullscreenCard>
        <h2>Histórico de notas - Nivel {nivel}</h2>
        <br />
        <div className='CenterTable'>
          {notas.length === 0 ? (
            <p>No hay notas para mostrar.</p>
          ) : (
            <table className='Table'>
              <thead>
                <tr>
                  <th style={{ width: '200px' }}>Nivel</th>
                  <th style={{ width: '200px' }}>Examen</th>
                  <th style={{ width: '200px' }}>Descripción</th>
                  <th style={{ width: '200px' }}>Nota examen escrito</th>
                  <th style={{ width: '200px' }}>Nota examen oral</th>
                  <th style={{ width: '200px' }}>Promedio</th>
                  <th style={{ width: '200px' }}>Retroalimentación</th>
                </tr>
              </thead>
              <tbody>
                {notas.map((nota) => (
                  <tr key={nota.examenId}>
                    <td>{nivel}</td>
                    <td>{nota.examen}</td>
                    <td>{nota.tematica} - {nota.examenId}</td>
                    <td>{nota.notaExamenEscrito}</td>
                    <td>{nota.notaExamenOral}</td>
                    <td>{nota.promedio}</td>
                    <td>{nota.comentario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <ButtonLink destino="/NivelesCulminados" clase="ButtonRegresar">Regresar</ButtonLink>
      </FullscreenCard>
    </motion.div>
  );
}

export default CulminarA2;