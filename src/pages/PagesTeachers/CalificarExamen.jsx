import React, { useState, useContext } from 'react';
import Swal from 'sweetalert2';
import Logo3 from '../../components/Logo3';
import { motion } from 'framer-motion';
import FullScreenCard from '../../components/FullScreenCard';
import { fetchBody } from '../../utils/fetch';
import Button from '../../components/Button';
import ButtonLink from '../../components/ButtonLink';
import ContenedorForms from '../../components/ContenedorForms';
import LabelInput from '../../components/LabelInput';
import Select from '../../components/Select';
import GeneralContext from '../../context/GeneralContext';

function CalificarExamen() {

  const { documento, changeDocumento } = useContext(GeneralContext);

  const [examenes, setExamenes] = useState([]);
  const [examenHabilitado, setExamenHabilitado] = useState(false);
  const [examenSeleccionado, setExamenSeleccionado] = useState("");

  const [niveles, setNiveles] = useState("");

  const [resultados, setResultados] = useState([]);
  const [modalData, setModalData] = useState({ tipo: '', contenido: '' });
  const [modalVisible, setModalVisible] = useState(false);
  const [backgroundOpacity] = useState(0.5);
  const [editModalOpen, setExamenModalOpen] = useState(false);
  const [intentos, setIntentos] = useState([]);
  const [intentoSeleccionado, setIntentoSeleccionado] = useState(null);
  const [nota, setNota] = useState("");
  const [comentario, setComentario] = useState("");
  const [botones, setBotones] = useState(false);

  const opcionesNiveles = [
    { nombre: 'A1', id: 1 },
    { nombre: 'A2', id: 2 },
    { nombre: 'B1', id: 3 },
    { nombre: 'B2', id: 4 },
    { nombre: 'C1', id: 5 }
  ];

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
      const respuesta = await fetchBody('/profesores/buscarExamen', 'POST', { documento, nivel: niveles, examen: examenSeleccionado });
      if (respuesta.exito) {
        setResultados(respuesta.examenEncontrado);
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

  async function handleVerExamenEscrito(examenEscrito) {
    setIntentos(Object.entries(examenEscrito));
    openExamenEscritoModal(examenEscrito);
  }

  const openExamenEscritoModal = (examen) => {
    setExamenModalOpen(true);
  };

  const handleCloseModalExamen = () => {
    setExamenModalOpen(false);
  };

  const handleChangeNivel = (e) => {
    const nivelSeleccionado = e.target.value;
    setNiveles(nivelSeleccionado); // Actualiza el estado de niveles correctamente
    obtenerExamenesPorNivel(nivelSeleccionado); // Llama a la API para obtener exámenes
  };

  const handleGuardarCalificacion = async () => {
    if (!nota) {
      Swal.fire({ 
        icon: 'warning', 
        title: 'Campo vacío', 
        text: 'Debe ingresar una nota antes de guardar.',
        customClass: {
          confirmButton: 'btn-color'
        },
        buttonsStyling: false  
      });
      return;
    }
    if (nota<0 || nota>5) {
      Swal.fire({ 
        icon: 'warning', 
        title: 'Nota inválida', 
        text: 'Debe ingresar una nota entre el rango 0.0 y 5.0',
        customClass: {
          confirmButton: 'btn-color'
        },
        buttonsStyling: false  
      });
      return;
    }
    try {
      const respuesta = await fetchBody('/profesores/calificarExamen', 'POST', { documento, nivel:niveles, examen: examenSeleccionado, nota });
      if (respuesta.exito) {
        Swal.fire({ 
          icon: 'success', 
          title: 'Guardado', 
          text: 'Nota guardada exitosamente.',
          customClass: {
            confirmButton: 'btn-color'
          },
          buttonsStyling: false 
        });
        setModalVisible(false);
      } else {
        Swal.fire({ 
          icon: 'error', 
          title: 'Error', 
          text: respuesta.error,
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
    }
  };

  const handleGuardarComentario = async () => {
    if (!comentario) {
      Swal.fire({ 
        icon: 'warning', 
        title: 'Campo vacío', 
        text: 'Debe ingresar un comentario antes de guardar.',
        customClass: {
          confirmButton: 'btn-color'
        },
        buttonsStyling: false
       });
      return;
    }
    try {
      const respuesta = await fetchBody('/profesores/guardarComentario', 'POST', { documento, nivel:niveles, examen: examenSeleccionado, comentario });
      if (respuesta.exito) {
        Swal.fire({ 
          icon: 'success', 
          title: 'Guardado', 
          text: 'Comentario guardado exitosamente.', 
          customClass: {
          confirmButton: 'btn-color'
          },
          buttonsStyling: false 
        });
        setModalVisible(false);
      } else {
        Swal.fire({ 
          icon: 'error', 
          title: 'Error', 
          text: respuesta.error,
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
    }
  };

  const downloadExamen = async (id, nivel) => {
      const data = {
        id: id,
        nivel: nivel
      }
      try {
        const respuesta = await fetchBody('/niveles/obtenerExamenOral', 'POST', data);
        if (respuesta.exito) {
          const url = respuesta.archivoUrl;
          window.open(url, '_blank');
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
          text: 'Error al procesar la solicitud para descargar el examen oral',
          customClass: {
            confirmButton: 'btn-color'
          },
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
                <th style={{ width: '250px' }}>Examen</th>
                <th style={{ width: '250px' }}>Examen Escrito</th>
                <th style={{ width: '350px' }}>Examen Oral</th>
                <th style={{ width: '420px' }}>Retroalimentación</th>
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
                  <td>{resultados.examen}</td>
                  <td><Button clase="Button" eventoClick={() => handleVerExamenEscrito(resultados.examenEscrito)}>Ver</Button></td>
                  <td>
                    <Button clase="Button" eventoClick={() => { setModalData({ tipo: 'calificar' }); setModalVisible(true); }}>Calificar</Button>
                    <Button clase="Button" eventoClick={() => {downloadExamen(examenSeleccionado, niveles)}}>Descargar</Button>
                  </td>
                  <td><Button clase="Button" eventoClick={() => { setModalData({ tipo: 'comentarios' }); setModalVisible(true); }}>Comentarios</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ButtonLink destino="/Teacher" clase="ButtonRegresar">Regresar</ButtonLink>

      </FullScreenCard>
      {modalVisible && (
        <>
          <div className="BackgroundOverlay" style={{ opacity: backgroundOpacity }} />
          <ContenedorForms>
            <h1>{modalData.tipo === 'calificar' ? 'Calificar Examen Oral' : 'Retroalimentación'}</h1>
            {modalData.tipo === 'calificar' ? (
              <>
                <label>Nota:</label>
                <input type="number" value={nota} onChange={(e) => setNota(e.target.value)} />
                <Button clase="Button" eventoClick={handleGuardarCalificacion}>Guardar</Button>
              </>
            ) : (
              <>
                <label>Comentarios:</label>
                <textarea value={comentario} onChange={(e) => setComentario(e.target.value)} />
                <Button clase="Button" eventoClick={handleGuardarComentario}>Guardar</Button>
              </>
            )}
            <Button clase="Button" eventoClick={() => setModalVisible(false)}>Cerrar</Button>
          </ContenedorForms>
        </>
      )}
      {editModalOpen && (
        <>
          <div
            className="BackgroundOverlay"
            style={{ opacity: backgroundOpacity }}
          />
          <ContenedorForms>
            <h1>Examen Escrito</h1>
            {intentoSeleccionado === null ? (
              intentos.map(([id, preguntas]) => (
                <div key={id}>
                  <label>{id}</label>
                  <Button clase="Button" eventoClick={() => setIntentoSeleccionado(preguntas)}>Ver</Button>
                  <Button clase="Button" eventoClick={handleCloseModalExamen}>Regresar</Button>
                </div>
              ))
            ) : (
              <>
                <div className='center'>
                  <table className="TablePreguntas">
                    <thead>
                      <tr>
                        <th>Pregunta</th>
                        <th>Check</th>
                        <th>Respuesta Correcta</th>
                        <th>Respuesta Dada</th>
                      </tr>
                    </thead>
                    <tbody>
                      {intentoSeleccionado.map((pregunta, index) => (
                        <tr key={index}>
                          <td>{pregunta.enunciado}</td>
                          <td>{pregunta.esCorrecta ? '✅' : '❌'}</td>
                          <td>{pregunta.respuestaCorrecta}</td>
                          <td>{pregunta.respuestaDada}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Button clase="Button" eventoClick={() => setIntentoSeleccionado(null)}>Regresar</Button>
              </>
            )}
          </ContenedorForms>
        </>
      )}
    </motion.div>

  );
}

export default CalificarExamen;
