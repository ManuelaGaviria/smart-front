import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Logo3 from '../components/Logo3';
import { motion } from 'framer-motion';
import FullScreenCard from '../components/FullScreenCard';
import { fetchBody, fetchGet } from '../utils/fetch';
import GeneralContext from '../context/GeneralContext';
import { useContext } from "react";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import Button from '../components/Button';
import ContenedorForms from '../components/ContenedorForms';
import ButtonLink from '../components/ButtonLink';
import LabelInputEdit from '../components/LabelInputEdit';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ActionsTeacher() {
  const navigate = useNavigate();
    useEffect(() => {
        const verificar = async () => {
            const respuesta = await fetchBody('/usuarios/', 'POST', {rol: "administrador"});
            if (respuesta.exito === false) {
                navigate("/")
            }
        }
        verificar();
    }, [])
    
  const { changeName, changeDocumento, changeCorreo, changeNacimiento } = useContext(GeneralContext);
  const [teachers, setTeachers] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [backgroundOpacity] = useState(0.5);

  useEffect(() => {
    listTeachers();
  }, []);

  const openEditModal = (teacher) => {
    setSelectedTeacher(teacher);
    setEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
  };

  async function listTeachers() {
    try {
      const respuesta = await fetchGet('/profesores/');
      if (respuesta.exito) {
        setTeachers(respuesta.lista)
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: respuesta.error,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: 'Error al procesar la solicitud para listar los profesores',
      });
    }
  }

  async function handleEdit(id) {
    const teacherToEdit = teachers.find(teacher => teacher.id === id);
    if (teacherToEdit) {
      openEditModal(teacherToEdit);
    } else {
      console.log('Profesor no encontrado');
    }
  }

  async function editTeacher(id) {
    const name = document.getElementById('teacherName').value;
    const documento = document.getElementById('teacherDocumento').value;
    const correo = document.getElementById('teacherEmail').value;
    const nacimiento = document.getElementById('teacherDate').value;
    if (name === "" || documento === "" || correo === "" || nacimiento === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor llena todos los campos",
        customClass: {
          confirmButton: 'btn-color'
        },
        buttonsStyling: false
      });
    } else {

      const data = {
        id: id,
        nombre: name,
        documento: documento,
        correo: correo,
        nacimiento: nacimiento
      }
      try {
          const respuesta = await fetchBody ('/profesores/editar','PUT',data) 
          if (respuesta.exito){
              Swal.fire({
                icon: "success",
                title: "Se actualizó profesor con éxito!",
                customClass: {
                  confirmButton: 'btn-color'
                },
                buttonsStyling: false
              });
              handleCloseModal();
              await listTeachers();
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
          text: 'Error al procesar la solicitud para editar un profesor',
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
      title: '¿Estás seguro de eliminar este profesor?',
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
      const data = { id: id };
      try {
        const respuesta = await fetchBody('/profesores/eliminar', 'DELETE', data );
        if (respuesta.exito){
          Swal.fire({
            icon: "success",
            title: "Profesor eliminado con éxito!",
            customClass: {
              confirmButton: 'btn-color'
            },
            buttonsStyling: false
          });
          await listTeachers();
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
          text: 'Error al procesar la solicitud para eliminar un profesor',
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
      initial={{ opacity: 0, x: 1000 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -1000 }}
      transition={{ duration: 1 }}
    >
      <Logo3 />
      <FullScreenCard>
        <div className='CenterTable'>
            <table className='Table'>
              <thead>
                <tr>
                  <th style={{ width: '250px' }}>Nombre</th>
                  <th style={{ width: '250px' }}>Documento</th>
                  <th style={{ width: '250px' }}>Correo</th>
                  <th style={{ width: '250px' }}>Fecha de Nacimiento</th>
                  <th style={{ width: '250px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td>{teacher.nombre}</td>
                    <td>{teacher.documento}</td>
                    <td>{teacher.correo}</td>
                    <td>{teacher.nacimiento}</td>
                    <td className='Actions'>
                      <button onClick={() => handleEdit(teacher.id)}><MdModeEdit /></button>
                      <button onClick={() => handleDelete(teacher.id)}><MdDelete /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
        <ButtonLink destino="/PrincipalTeacher" clase="ButtonRegresar">Regresar</ButtonLink>
      </FullScreenCard>
      {editModalOpen && (
      <>
        <div
          className="BackgroundOverlay"
          style={{ opacity: backgroundOpacity }}
        />
        <ContenedorForms>
          <h1>Editar Profesor</h1>
          <div className="InputContainer">
            <LabelInputEdit id='teacherName' texto="Nombre" eventoCambio={changeName} valorInicial={selectedTeacher.nombre}></LabelInputEdit>
            <LabelInputEdit id='teacherDocumento' tipo="number" texto="Documento" eventoCambio={changeDocumento} valorInicial={selectedTeacher.documento}></LabelInputEdit>
            <LabelInputEdit id='teacherEmail' tipo="email" texto="Correo" eventoCambio={changeCorreo} valorInicial={selectedTeacher.correo}></LabelInputEdit>
            <LabelInputEdit id='teacherDate' tipo="date" texto="Fecha Nacimiento" eventoCambio={changeNacimiento} valorInicial={selectedTeacher.nacimiento}></LabelInputEdit>
          </div>
          <br />
          <Button clase="Button" eventoClick={() => editTeacher(selectedTeacher.id)}>Editar</Button>
          <Button clase="Button" eventoClick={handleCloseModal}>Regresar</Button>
        </ContenedorForms>
      </>
    )}
    </motion.div>
  );
}

export default ActionsTeacher;


