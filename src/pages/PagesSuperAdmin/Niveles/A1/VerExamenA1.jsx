import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import Logo3 from '../../../../components/Logo3';
import { motion } from 'framer-motion';
import FullscreenCard from '../../../../components/FullScreenCard';
import ButtonLink from '../../../../components/ButtonLink';
import { fetchBody } from '../../../../utils/fetch';
import ContenedorForms from '../../../../components/ContenedorForms';
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { IoCloudUpload } from "react-icons/io5";
import GeneralContext from '../../../../context/GeneralContext';
import Swal from 'sweetalert2';
import SelectEdit from '../../../../components/SelectEdit';
import LabelInputEdit from '../../../../components/LabelInputEdit';
import Button from '../../../../components/Button';
import ButtonLinkState from '../../../../components/ButtonLinkState';

function VerExamenA1() {
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

    const [clases, setClases] = useState([]);
    const [claseSeleccionada, setClaseSeleccionada] = useState("");

    useEffect(() => {
        const listClases = async () => {
          try {
            const respuesta = await fetchBody('/niveles/obtenerClase', 'POST', {nivel: "A1"});
            if (respuesta.exito) {
              const clasesFormateadas = respuesta.lista.map(clase => ({
                nombre: clase.id,
                id: clase.id
              }));
              setClases(clasesFormateadas);
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
              text: 'Error al procesar la solicitud para listar las clases',
              customClass: {
                confirmButton: 'btn-color'
              },
              buttonsStyling: false
            });
          }
        }
        listClases();
      }, []);

      const handleChange = (e) => {
        setClaseSeleccionada(e.target.value); // Actualizar el estado con la clase seleccionada
        console.log('Clase seleccionada:', e.target.value);
      };

    const { changeNumero, changeDescripcion, changeUnidades } = useContext(GeneralContext);
    const [examenes, setExamen] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedExamen, setSelectedExamen] = useState(null);
    const [backgroundOpacity] = useState(0.5);

    useEffect(() => {
      listExamenes();
    }, []);

    const openEditModal = (examen) => {
        setSelectedExamen(examen);
        setEditModalOpen(true); 
      };
    
      const handleCloseModal = () => {
        setEditModalOpen(false);
      };

      async function listExamenes() {
        try {
          const respuesta = await fetchBody ('/niveles/listarExamen','POST', {nivel: "A1"}) 
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
        const numero = document.getElementById('idExamen').value;
        const unidades = document.getElementById('idUnidades').value;
        const tematica = document.getElementById('idTematica').value;
        if (numero === "" || unidades === "" || tematica === "") {
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
              examen: numero,
              unidades: unidades,
              tematica: tematica,
              clase: claseSeleccionada,
              nivel: "A1"
            };
            console.log(data);
            try {
              const respuesta = await fetchBody ('/niveles/editarExamen','PUT',data) 
              if (respuesta.exito){
                  Swal.fire({
                    icon: "success",
                    title: "Se actualizó el examen con éxito!",
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
              text: 'Error al procesar la solicitud para editar un administrador',
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
          title: '¿Estás seguro de eliminar este examen?',
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
          const data = { id: id, nivel: "A1"};
          try {
            const respuesta = await fetchBody('/niveles/eliminarExamen', 'DELETE', data );
            if (respuesta.exito){
              Swal.fire({
                icon: "success",
                title: "Examen eliminado con éxito!",
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
              text: 'Error al procesar la solicitud para eliminar un examen',
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
                <div className='CenterTable'>
                    <table className='Table'>
                        <thead>
                            <tr>
                                <th style={{ width: '200px' }}>Examen #</th>
                                <th style={{ width: '200px' }}>Unidades</th>
                                <th style={{ width: '200px' }}>Temática</th>
                                <th style={{ width: '200px' }}>Clase que lo desbloquea</th>
                                <th style={{ width: '200px' }}>Examen Escrito</th>
                                <th style={{ width: '200px' }}>Examen Oral</th>
                                <th style={{ width: '200px' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                        {examenes.map((examen) => (
                            <tr key={examen.id}>
                                <td>{examen.examen}</td>
                                <td>{examen.unidades}</td>
                                <td>{examen.tematica}</td>
                                <td>{examen.clase}</td>
                                <td>
                                    <ButtonLinkState clase="btn-ver" destino="/VerExamenEscritoA1" estado={{ examenId: examen.id }}>Ver</ButtonLinkState>
                                </td>
                                <td>
                                    <button className='btn-upload'><IoCloudUpload /></button>
                                    <ButtonLinkState clase="btn-ver" destino="/VerExamenOralA1" estado={{ examenId: examen.id }}>Ver</ButtonLinkState>
                                </td>
                                <td className='Actions'>
                                <button className='btn-edit' onClick={() => handleEdit(examen.id)}><MdModeEdit /></button>
                                <button className='btn-delete' onClick={() => handleDelete(examen.id)}><MdDelete /></button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <ButtonLink destino="/GestionarExamenA1" clase="ButtonRegresar">Regresar</ButtonLink>
            </FullscreenCard>

            {editModalOpen && (
                <>
                    <div
                    className="BackgroundOverlay"
                    style={{ opacity: backgroundOpacity }}
                    />
                    <ContenedorForms>
                        <h1>Editar Examen</h1>
                        <div className="InputContainer">
                        <LabelInputEdit id="idExamen" tipo="number" texto="Examen #" eventoCambio={changeNumero} valorInicial={selectedExamen.examen}></LabelInputEdit>
                        <LabelInputEdit id="idUnidades" eventoCambio={changeUnidades} texto="Unidades" valorInicial={selectedExamen.unidades}></LabelInputEdit>
                        <LabelInputEdit id="idTematica" texto="Temática" eventoCambio={changeDescripcion} valorInicial={selectedExamen.tematica}></LabelInputEdit>
                        <SelectEdit titulo="Clase que lo desbloquea"
                                opciones={clases}
                                eventoCambio={handleChange}
                                valorInicial={selectedExamen.clase}>
                        </SelectEdit>
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

export default VerExamenA1;
