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
import Swal from 'sweetalert2';
import LabelInputEdit from '../../../../components/LabelInputEdit';
import Button from '../../../../components/Button';
import GeneralContext from '../../../../context/GeneralContext';

function VerClaseA1() {
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

    const { changeCodigo, changeNumero, changeDescripcion } = useContext(GeneralContext);
    const [clases, setClase] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedClase, setSelectedClase] = useState(null);
    const [backgroundOpacity] = useState(0.5);

    useEffect(() => {
      listClases();
    }, []);

    const openEditModal = (clase) => {
        setSelectedClase(clase);
        setEditModalOpen(true); 
      };
    
      const handleCloseModal = () => {
        setEditModalOpen(false);
      };

    async function listClases() {
      try {
        const respuesta = await fetchBody ('/niveles/listarClase','POST', {nivel: "A1"}) 
        if (respuesta.exito) {
          setClase(respuesta.lista)
          console.log(respuesta.lista);
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

    async function handleEdit(id) {
        const claseToEdit = clases.find(clase => clase.id === id);
        if (claseToEdit) {
          openEditModal(claseToEdit);
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: 'Clase no encontrada',
            customClass: {
              confirmButton: 'btn-color'
            },
            buttonsStyling: false
          });
        }
      }

      async function editClase(id) {
        const codigo = document.getElementById('codigo').value;
        const numero = document.getElementById('numero').value;
        const descripcion = document.getElementById('descripcion').value;
        if (codigo === "" || numero === "" || descripcion === "") {
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
              codigo: codigo,
              numero: numero,
              descripcion: descripcion,
              nivel: "A1"
            };
            console.log(data);
            try {
              const respuesta = await fetchBody ('/niveles/editarClase','PUT',data) 
              console.log(respuesta);
              if (respuesta.exito){
                  Swal.fire({
                    icon: "success",
                    title: "Se actualizó la clase con éxito!",
                    customClass: {
                      confirmButton: 'btn-color'
                    },
                    buttonsStyling: false
                  });
                  handleCloseModal();
                  await listClases();
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
          title: '¿Estás seguro de eliminar esta clase?',
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
            const respuesta = await fetchBody('/niveles/eliminarClase', 'DELETE', data );
            if (respuesta.exito){
              Swal.fire({
                icon: "success",
                title: "Clase eliminada con éxito!",
                customClass: {
                  confirmButton: 'btn-color'
                },
                buttonsStyling: false
              });
              await listClases();
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
              text: 'Error al procesar la solicitud para eliminar una clase',
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
                                <th style={{ width: '200px' }}>Código</th>
                                <th style={{ width: '200px' }}>Clase #</th>
                                <th style={{ width: '200px' }}>Descripción</th>
                                <th style={{ width: '200px' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clases.map((clase) => (
                            <tr key={clase.id}>
                                <td>{clase.codigo}</td>
                                <td>Clase {clase.numero}</td>
                                <td>{clase.descripcion}</td>
                                <td className='Actions'>
                                <button className='btn-edit' onClick={() => handleEdit(clase.id)}><MdModeEdit /></button>
                                <button className='btn-delete' onClick={() => handleDelete(clase.id)}><MdDelete /></button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <ButtonLink destino="/GestionarClaseA1" clase="ButtonRegresar">Regresar</ButtonLink>
            </FullscreenCard>
            {editModalOpen && (
            <>
                <div
                className="BackgroundOverlay"
                style={{ opacity: backgroundOpacity }}
                />
                <ContenedorForms>
                <h1>Editar Clase</h1>
                <div className="InputContainer">
                    <LabelInputEdit id='codigo' texto="Codigo" eventoCambio={changeCodigo} valorInicial={selectedClase.codigo}></LabelInputEdit>
                    <LabelInputEdit id="numero" tipo="number" texto="Clase #" eventoCambio={changeNumero} valorInicial={selectedClase.numero}></LabelInputEdit>
                    <LabelInputEdit id='descripcion' texto="Documento" eventoCambio={changeDescripcion} valorInicial={selectedClase.descripcion}></LabelInputEdit>

                </div>
                <br />
                <Button clase="Button" eventoClick={() => editClase(selectedClase.id)}>Editar</Button>
                <Button clase="Button" eventoClick={handleCloseModal}>Regresar</Button>
                </ContenedorForms>
            </>
            )}
        </motion.div>
    );
}

export default VerClaseA1;
