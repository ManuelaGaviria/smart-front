import React, { useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import Logo3 from '../components/Logo3';
import { motion } from 'framer-motion';
import FullScreenCard from '../components/FullScreenCard';
import { fetchBody } from '../utils/fetch';
import { useNavigate } from 'react-router-dom';
import ButtonLink from '../components/ButtonLink';
import LabelInput from '../components/LabelInput';
import Select from '../components/Select';
import GeneralContext from '../context/GeneralContext';

function GestionarSolicitudes() {
  const navigate = useNavigate();

  useEffect(() => {
    const verificar = async () => {
      const respuesta = await fetchBody('/usuarios/', 'POST', { rol: "administrador" });
      if (respuesta.exito === false) {
        navigate("/")
      }
    };
    verificar();
  }, []);

  const { documento, changeDocumento } = useContext(GeneralContext);
  const [solicitudes, setSolicitudes] = useState([]);
  const [examenes, setExamenes] = useState([]);
  const [examenHabilitado, setExamenHabilitado] = useState(false);
  const [examenSeleccionado, setExamenSeleccionado] = useState("");
  const [niveles, setNiveles] = useState("");
  const [botones, setBotones] = useState(false);
  const [resultados, setResultados] = useState([]);

  const opcionesNiveles = [
    { nombre: 'A1', id: 1 },
    { nombre: 'A2', id: 2 },
    { nombre: 'B1', id: 3 },
    { nombre: 'B2', id: 4 },
    { nombre: 'C1', id: 5 }
  ];

  const handleChangeNivel = (e) => {
    const nivelSeleccionado = e.target.value;
    setNiveles(nivelSeleccionado); // Actualiza el estado de niveles correctamente
    obtenerExamenesPorNivel(nivelSeleccionado); // Llama a la API para obtener exámenes
  };

  const handleBuscar = async () => {
    if (!documento || !niveles || !examenSeleccionado) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Debe completar todos los campos antes de continuar.',
        customClass: {
          confirmButton: 'btn-color'
        },
        buttonsStyling: false
      });
      setBotones(false);
      return;
    }

    try {
      const respuesta = await fetchBody('/solicitudes/buscarSolicitud', 'POST', { documento, nivel: niveles, examen: examenSeleccionado });
      if (respuesta.exito) {
        setResultados(respuesta.lista);
        setBotones(true);
      } else {
        setResultados([]);
        setBotones(false);
        Swal.fire({
          icon: 'info',
          title: 'No hay datos',
          text: 'No se encontraron registros para los criterios seleccionados.',
          customClass: {
            confirmButton: 'btn-color'
          },
          buttonsStyling: false
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al procesar la solicitud.',
        customClass: {
          confirmButton: 'btn-color'
        },
        buttonsStyling: false
      });
      setBotones(false);
    }
  };

  const obtenerExamenesPorNivel = async (nivelId) => {
    try {
      const respuesta = await fetchBody('/niveles/obtenerExamen', 'POST', { nivel: nivelId });

      if (respuesta.exito && respuesta.lista.length > 0) { // Solo habilitar si hay exámenes
        const examenesFormateados = respuesta.lista.map(examen => ({
          nombre: examen.id,
          id: examen.id
        }));
        setExamenes(examenesFormateados);
        setExamenHabilitado(true); // Ahora sí habilita el Select
      } else {
        setExamenHabilitado(false); // Asegura que si no hay exámenes, no se muestre el select
        Swal.fire({
          icon: "warning",
          title: "No hay exámenes disponibles",
          text: "No se encontraron exámenes para este nivel.",
          customClass: {
            confirmButton: 'btn-color'
          },
          buttonsStyling: false
        });
      }
    } catch (error) {
      setExamenHabilitado(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: 'Error al procesar la solicitud para listar los exámenes',
        customClass: {
          confirmButton: 'btn-color'
        },
        buttonsStyling: false
      });
    }
  };

  const confirmarAccion = async (accion, estudiante, nivel, estado, examen) => {
    // Si la solicitud ya está resuelta, mostrar alerta y salir
    if (estado === 'aprobado' || estado === 'rechazado') {
      Swal.fire({
        icon: 'info',
        title: 'Solicitud ya respondida',
        text: `Esta solicitud ya fue ${estado}. No se puede modificar.`,
        customClass: {
          confirmButton: 'btn-color'
        },
        buttonsStyling: false
      });
      return;
    }

    const resultado = await Swal.fire({
      title: `¿Estás seguro de ${accion === 'aprobar' ? 'aprobar' : 'rechazar'} esta solicitud?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'btn-color',
        cancelButton: 'btn-color-cancel'
      },
      buttonsStyling: false
    });

    if (resultado.isConfirmed) {
      const nuevoEstado = accion === 'aprobar' ? 'aprobado' : 'rechazado';

      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se encontró un token de autenticación. Inicia sesión nuevamente.',
          customClass: { confirmButton: 'btn-color' },
          buttonsStyling: false,
        });
        return;
      }

      const payload = JSON.parse(atob(token.split('.')[1]));
      const idAdmin = payload.id;

      const data = {
        idEstudiante: estudiante,
        nivel: nivel,
        examen: examen,
        estado: nuevoEstado,
        idAdmin
      };

      const respuesta = await fetchBody('/solicitudes/actualizarEstado', 'POST', data);

      if (respuesta.exito) {
        Swal.fire({
          icon: 'success',
          title: 'Solicitud actualizada',
          text: `Se ha ${nuevoEstado} la solicitud correctamente.`,
          customClass: {
            confirmButton: 'btn-color'
          },
          buttonsStyling: false
        });

        // Actualizar estado localmente
        setSolicitudes(prev => prev.map(est => {
          if (est.idEstudiante !== estudiante.idEstudiante) return est;
          return {
            ...est,
            niveles: est.niveles.map(niv => {
              if (niv.idNivel !== nivel.idNivel) return niv;
              return {
                ...niv,
                examenes: niv.examenes.map(ex => {
                  if (ex.idExamen !== examen.idExamen) return ex;
                  return { ...ex, estado: nuevoEstado };
                })
              };
            })
          };
        }));

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: respuesta.error || 'Error al actualizar la solicitud',
          customClass: {
            confirmButton: 'btn-color'
          },
          buttonsStyling: false
        });
      }
    }
  };

  return (
    <motion.div
      className='ContainerFull'
      initial={{ opacity: 0, x: 1000 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -1000 }}
      transition={{ duration: 1 }}
    >
      <Logo3 />
      <FullScreenCard>
        {/* Contenedor del formulario encima de la tabla */}
        <div className="form-wrapper">
          <div className="form-container">
            {/* Fila de los filtros */}
            <div className="form-row">
              <LabelInput texto="Documento Estudiante" eventoCambio={changeDocumento} />

              <Select id="idNivel" titulo="Nivel" opciones={opcionesNiveles} eventoCambio={handleChangeNivel} />

              {examenHabilitado && examenes.length > 0 && (
                <Select id="idExamen" titulo="Examen" opciones={examenes} eventoCambio={(e) => setExamenSeleccionado(e.target.value)} />
              )}
            </div>

            {/* Fila del botón */}
            <div className="button-container">
              <button onClick={handleBuscar} className="ButtonBuscar">
                Buscar
              </button>
            </div>
          </div>
        </div>
        {/* Tabla de resultados */}
        <div className="CenterTable">
          <table className="Table">
            <thead>
              <tr>
                <th style={{ width: '250px' }}>Nombre Estudiante</th>
                <th style={{ width: '250px' }}>Documento</th>
                <th style={{ width: '250px' }}>Nivel</th>
                <th style={{ width: '250px' }}>Examen</th>
                <th style={{ width: '250px' }}>Estado</th>
                <th style={{ width: '250px' }}>Intentos</th>
                <th style={{ width: '250px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {!botones ? (
                <tr>
                  <td colSpan="5">
                    <p>Selecciona datos para filtrar</p>
                  </td>
                </tr>
              ) : (
                resultados && (
                  <tr>
                    <td>{resultados.nombreCompleto}</td>
                    <td>{resultados.documento}</td>
                    <td>{resultados.nivel}</td>
                    <td>{resultados.examen}</td>
                    <td>{resultados.estado}</td>
                    <td>{resultados.intentos + 1}</td>
                    <td>
                      <button
                        className="BtnSuccess"
                        onClick={() => confirmarAccion('aprobar', resultados.idEstudiante, resultados.nivel, resultados.estado, resultados.examen)}
                      >
                        ✅
                      </button>
                      <button
                        className="BtnDanger"
                        onClick={() => confirmarAccion('rechazar', resultados.idEstudiante, resultados.nivel, resultados.estado, resultados.examen)}
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <ButtonLink destino="/Admin" clase="ButtonRegresar">Regresar</ButtonLink>

      </FullScreenCard>
    </motion.div>

  );
}

export default GestionarSolicitudes;