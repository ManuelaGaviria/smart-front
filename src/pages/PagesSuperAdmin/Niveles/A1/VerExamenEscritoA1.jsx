import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Logo3 from '../../../../components/Logo3';
import { motion } from 'framer-motion';
import FullscreenCard from '../../../../components/FullScreenCard';
import ButtonLink from '../../../../components/ButtonLink';
import { fetchBody } from '../../../../utils/fetch';
import ContenedorForms from '../../../../components/ContenedorForms';
import DateSelect from '../../../../components/DateSelect';
import Checkbox from '../../../../components/Checkbox';
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import LabelInputEdit from '../../../../components/LabelInputEdit';
import GeneralContext from '../../../../context/GeneralContext';
import Select from '../../../../components/Select';
import Button from '../../../../components/Button';
import Swal from 'sweetalert2';
import SelectEdit from '../../../../components/SelectEdit';

function VerExamenEscritoA1() {
    const navigate = useNavigate();

    useEffect(() => {
        const verificar = async () => {
            const respuesta = await fetchBody('/usuarios/', 'POST', {rol: "superadministrador"});
            if (respuesta.exito === false) {
                navigate("/")
            }
        }
        verificar();
    }, [navigate]);

    const location = useLocation();
    const { examenId } = location.state || {};

    const { pregunta, respuesta1, respuesta2, respuesta3, respuesta4, respuestaCorrecta, changePregunta, changeRespuesta1, changeRespuesta2, changeRespuesta3, changeRespuesta4, changeRespuestaCorrecta } = useContext(GeneralContext);

    const opcionesRespuesta = [
        { nombre: 'respuesta1', id: 1 },
        { nombre: 'respuesta2', id: 2 },
        { nombre: 'respuesta3', id: 3 },
        { nombre: 'respuesta4', id: 4 },
      ];

    const [asignModalOpen, setAsignModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [examenes, setExamen] = useState([]);
    const [selectedExamen, setSelectedExamen] = useState(null);
    const [backgroundOpacity] = useState(0.5);

    useEffect(() => {
        listExamenes();
      }, []);

    const openAsignModal = () => {
        setAsignModalOpen(true);
    };

    const handleCloseModal = () => {
        setAsignModalOpen(false);
        setEditModalOpen(false);
    };

    const openEditModal = (examen) => {
        setSelectedExamen(examen);
        setEditModalOpen(true); 
      };


    async function listExamenes() {
        try {
            const data = {
                nivel: "A1",
                examenId: examenId
            }
          const respuesta = await fetchBody ('/niveles/listarExamenEscrito','POST', data) 
          if (respuesta.exito) {
            setExamen(respuesta.lista)
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

    async function validate() {
        if (pregunta === "" || respuesta1 === "" || respuesta2 === "" || respuesta3 === "" || respuesta4 === "") {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Por favor llena todos los campos.",
              customClass: {
                confirmButton: 'btn-color'
              },
              buttonsStyling: false
            });
        } else {
            const data = {
                nivel: "A1",
              examenId: examenId,
              pregunta: pregunta,
              respuesta1: respuesta1,
              respuesta2: respuesta2,
              respuesta3: respuesta3,
              respuesta4: respuesta4,
              respuestaCorrecta: respuestaCorrecta
            };
            try {
              const respuesta = await fetchBody('/niveles/agregarExamenEscrito', 'POST', data);
              if (respuesta.exito) {
                changePregunta({ target: { value: '' } });
                changeRespuesta1({ target: { value: '' } });
                changeRespuesta2({ target: { value: '' } });
                changeRespuesta3({ target: { value: '' } });
                changeRespuesta4({ target: { value: '' } });
                document.getElementById("pregunta").value = "";
                document.getElementById("respuesta1").value = "";
                document.getElementById("respuesta2").value = "";
                document.getElementById("respuesta3").value = "";
                document.getElementById("respuesta4").value = "";
                Swal.fire({
                  icon: "success",
                  title: "Examen creado con éxito!",
                  customClass: {
                    confirmButton: 'btn-color'
                  },
                  buttonsStyling: false
                });
                navigate("/VerExamenA1");
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
                text: 'Error al procesar la solicitud para crear un estudiante',
                customClass: {
                  confirmButton: 'btn-color'
                },
                buttonsStyling: false
              });
            }
          }
    }

    async function handleEdit(id) {
        const examenToEdit = examenes.find(examen => examen.id === id);
        if (examenToEdit) {
          openEditModal(examenToEdit);
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: 'Examen no encontrado',
            customClass: {
              confirmButton: 'btn-color'
            },
            buttonsStyling: false
          });
        }
      }

      async function editExamen(id) {
        const pregunta = document.getElementById('idpregunta').value;
        const respuesta1 = document.getElementById('idrespuesta1').value;
        const respuesta2 = document.getElementById('idrespuesta2').value;
        const respuesta3 = document.getElementById('idrespuesta3').value;
        const respuesta4 = document.getElementById('idrespuesta4').value;

        if (pregunta === "" || respuesta1 === "" || respuesta2 === "" || respuesta3 === "" || respuesta4 === "") {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Por favor llena todos los campos.",
            customClass: {
              confirmButton: 'btn-color'
            },
            buttonsStyling: false
          });
        } else {
            const data = {
              id:id,
              examenId, examenId,
              pregunta: pregunta,
              respuesta1: respuesta1,
              respuesta2: respuesta2,
              respuesta3: respuesta3,
              respuesta4: respuesta4,
              respuestaCorrecta: respuestaCorrecta,
              nivel: "A1"
            };
            try {
              const respuesta = await fetchBody ('/niveles/editarExamenEscrito','PUT',data) 
              if (respuesta.exito){
                  Swal.fire({
                    icon: "success",
                    title: "Se actualizó la pregunta con éxito!",
                    customClass: {
                      confirmButton: 'btn-color'
                    },
                    buttonsStyling: false
                  });
                  handleCloseModal();
                  await listExamenes();
              }
              else {
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
              text: 'Error al procesar la solicitud para editar una pregunta',
              customClass: {
                confirmButton: 'btn-color'
              },
              buttonsStyling: false
            });
          }
          }
      }

      async function handleDelete(id) {
        // Mostrar una alerta de confirmación antes de eliminar al profesor
        const confirmacion = await Swal.fire({
          title: '¿Estás seguro de eliminar esta pregunta?',
          text: "Esta acción no se puede revertir",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          customClass: {
            confirmButton: 'btn-color',
            cancelButton: 'btn-color-cancel'
          },
          buttonsStyling: false
      });
        
        // Verificar si el usuario confirmó la eliminación
        if (confirmacion.isConfirmed) {
          const data = { 
            id: id, 
            nivel: "A1",
            examenId: examenId
        };
          try {
            const respuesta = await fetchBody('/niveles/eliminarExamenEscrito', 'DELETE', data );
            if (respuesta.exito){
              Swal.fire({
                icon: "success",
                title: "Pregunta eliminada con éxito!",
                customClass: {
                  confirmButton: 'btn-color'
                },
                buttonsStyling: false
              });
              await listExamenes();
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
              text: 'Error al procesar la solicitud para eliminar una pregunta',
              customClass: {
                confirmButton: 'btn-color'
              },
              buttonsStyling: false
            });
          }
        }
      }

    return (
        <motion.div
            className='ContainerFull'
            initial={{ opacity: 0, x: 1000 }} // Inicia desde la derecha
            animate={{ opacity: 1, x: 0 }} // Animación hacia la izquierda
            exit={{ opacity: 0, x: -1000 }} // Sale hacia la izquierda
            transition={{ duration: 1 }}>
            <Logo3 />
            <FullscreenCard>
                <div>
                    <button onClick={openAsignModal} className="ButtonRegresar">Crear Pregunta</button>
                </div>
                <br />
                <div className='CenterTable'>
                    <table className='Table'>
                        <thead>
                            <tr>
                                <th style={{ width: '200px' }}>Pregunta</th>
                                <th style={{ width: '200px' }}>Respuesta 1</th>
                                <th style={{ width: '200px' }}>Respuesta 2</th>
                                <th style={{ width: '200px' }}>Respuesta 3</th>
                                <th style={{ width: '200px' }}>Respuesta 4</th>
                                <th style={{ width: '200px' }}>Respuesta Correcta</th>
                                <th style={{ width: '200px' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                        {examenes.map((examen) => (
                            <tr key={examen.id}>
                                <td>{examen.pregunta}</td>
                                <td>{examen.respuesta1}</td>
                                <td>{examen.respuesta2}</td>
                                <td>{examen.respuesta3}</td>
                                <td>{examen.respuesta4}</td>
                                <td>{examen.respuestaCorrecta}</td>
                                <td className='Actions'>
                                    <button className='btn-edit' onClick={() => handleEdit(examen.id)}><MdModeEdit /></button>
                                    <button className='btn-delete' onClick={() => handleDelete(examen.id)}><MdDelete /></button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <ButtonLink destino="/VerExamenA1" clase="ButtonRegresar">Regresar</ButtonLink>
            </FullscreenCard>

            {asignModalOpen && (
                <>
                    <div
                    className="BackgroundOverlay"
                    style={{ opacity: backgroundOpacity }}
                    />
                    <ContenedorForms>
                        <h1>Crear Pregunta</h1>
                        <div className="InputContainer">
                            <LabelInputEdit id="pregunta" texto="Pregunta" eventoCambio={changePregunta}></LabelInputEdit>
                            <LabelInputEdit id="respuesta1" texto="Respuesta 1" eventoCambio={changeRespuesta1}></LabelInputEdit>
                            <LabelInputEdit id="respuesta2" texto="Respuesta 2" eventoCambio={changeRespuesta2}></LabelInputEdit>
                            <LabelInputEdit id="respuesta3" texto="Respuesta 3" eventoCambio={changeRespuesta3}></LabelInputEdit>
                            <LabelInputEdit id="respuesta4" texto="Respuesta 4" eventoCambio={changeRespuesta4}></LabelInputEdit> 
                            <Select id="opcionesRespuesta" titulo="Respuesta Correcta" opciones={opcionesRespuesta} eventoCambio={changeRespuestaCorrecta}></Select>   
                        </div>
                        <button onClick={handleCloseModal} className="ButtonRegresar">Regresar</button>
                        <Button eventoClick={validate} clase="ButtonRegresar">Terminar</Button>
                        <br />
                        <br />
                        
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
                        <h1>Editar Examen</h1>
                        <div className="InputContainer">
                            <div className="InputContainer">
                                <LabelInputEdit id="idpregunta" texto="Pregunta" eventoCambio={changePregunta} valorInicial={selectedExamen.pregunta}></LabelInputEdit>
                                <LabelInputEdit id="idrespuesta1" texto="Respuesta 1" eventoCambio={changeRespuesta1} valorInicial={selectedExamen.respuesta1}></LabelInputEdit>
                                <LabelInputEdit id="idrespuesta2" texto="Respuesta 2" eventoCambio={changeRespuesta2} valorInicial={selectedExamen.respuesta2}></LabelInputEdit>
                                <LabelInputEdit id="idrespuesta3" texto="Respuesta 3" eventoCambio={changeRespuesta3} valorInicial={selectedExamen.respuesta3}></LabelInputEdit>
                                <LabelInputEdit id="idrespuesta4" texto="Respuesta 4" eventoCambio={changeRespuesta4} valorInicial={selectedExamen.respuesta4}></LabelInputEdit> 
                                <SelectEdit titulo="Respuesta correcta"
                                    opciones={opcionesRespuesta}
                                    valorInicial={selectedExamen.respuestaCorrecta}
                                    eventoCambio={changeRespuestaCorrecta}
                                ></SelectEdit>
                                
                            </div>
                        </div>
                        <br />
                        <Button clase="Button" eventoClick={() => editExamen(selectedExamen.id)}>Editar</Button>
                        <Button clase="Button" eventoClick={handleCloseModal}>Regresar</Button>
                    </ContenedorForms>
                </>
            )}
        </motion.div>
    );
}

export default VerExamenEscritoA1;
