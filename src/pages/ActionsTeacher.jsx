import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Logo3 from '../components/Logo3';
import { motion } from 'framer-motion';
import FullScreenCard from '../components/FullScreenCard';
import { fetchBody } from '../utils/fetch';
import GeneralContext from '../context/GeneralContext';
import { useContext } from "react";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import Button from '../components/Button';
import ContenedorForms from '../components/ContenedorForms';
import ButtonLink from '../components/ButtonLink';
import LabelInputEdit from '../components/LabelInputEdit';
import { useNavigate } from 'react-router-dom';
import SelectEdit from '../components/SelectEdit';

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

  const { changeName, changeApellido, changeTipoDocumento, changeDocumento, changeCorreo, changeGenero, changeNacimiento } = useContext(GeneralContext);
  const [teachers, setTeachers] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [backgroundOpacity] = useState(0.5);

  const opcionesDocumento = [
    { nombre: 'CC', id: 2 },
    { nombre: 'CE', id: 3 }
  ];

  const opcionesGenero = [
    { nombre: 'Femenino', id: 1 },
    { nombre: 'Masculino', id: 2 }
  ];

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
      const respuesta = await fetchBody ('/usuarios/listar','POST', {rol: "profesor"}) 
      if (respuesta.exito) {
        setTeachers(respuesta.lista)
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
        text: 'Error al procesar la solicitud para listar los profesores',
        customClass: {
          confirmButton: 'btn-color'
        },
        buttonsStyling: false
      });
    }
  }

  async function handleEdit(id) {
    const teacherToEdit = teachers.find(teacher => teacher.id === id);
    if (teacherToEdit) {
      openEditModal(teacherToEdit);
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: 'Profesor no encontrado',
        customClass: {
          confirmButton: 'btn-color'
        },
        buttonsStyling: false
      });
    }
  }

  async function editTeacher(id) {
    const name = document.getElementById('teacherName').value;
    const apellido = document.getElementById('teacherApellido').value;
    const tipoDocumento = document.getElementById('teacherTipoDocumento').value;
    const documento = document.getElementById('teacherDocumento').value;
    const correo = document.getElementById('teacherEmail').value;
    const genero = document.getElementById('teacherGenero').value;
    const nacimiento = document.getElementById('teacherDate').value;
    if (name === "" || apellido === "" || tipoDocumento === "" || documento === "" || correo === "" || genero === "" || nacimiento === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor llena todos los campos.",
        customClass: {
          confirmButton: 'btn-color'
        },
        buttonsStyling: false
      });
    } else if (correo.indexOf('@') === -1) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "El correo electrónico debe contener un arroba (@).",
        customClass: {
          confirmButton: 'btn-color'
        },
        buttonsStyling: false
      });
    } else if (!/^\d+$/.test(documento) || parseInt(documento) < 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "El documento debe contener solo números positivos y sin puntos ni comas.",
        customClass: {
          confirmButton: 'btn-color'
        },
        buttonsStyling: false
      });
    } else {
      var fechaNacimiento = new Date(nacimiento);
      var edadMinima = new Date();
      edadMinima.setFullYear(edadMinima.getFullYear() - 18); // Restar 8 años a la fecha actual
      
      if (fechaNacimiento >= new Date() || fechaNacimiento > edadMinima) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "La fecha de nacimiento no puede ser posterior a la fecha actual y el estudiante debe tener al menos 18 años.",
          customClass: {
            confirmButton: 'btn-color'
          },
          buttonsStyling: false
        });
      } else {
        const data = {
          id:id,
          nombre: name,
          apellido: apellido,
          tipoDocumento: tipoDocumento,
          documento: documento,
          correo: correo,
          genero: genero,
          nacimiento: nacimiento,
          rol: "profesor"
        };
        try {
          const respuesta = await fetchBody ('/usuarios/editar','PUT',data) 
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
      const data = { id: id, rol: "profesor"};
      try {
        const respuesta = await fetchBody('/usuarios/eliminar', 'DELETE', data );
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
                  <th style={{ width: '250px' }}>Apellidos</th>
                  <th style={{ width: '250px' }}>Tipo Documento</th>
                  <th style={{ width: '250px' }}>Documento</th>
                  <th style={{ width: '250px' }}>Correo</th>
                  <th style={{ width: '250px' }}>Genero</th>
                  <th style={{ width: '250px' }}>Fecha de Nacimiento</th>
                  <th style={{ width: '250px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td>{teacher.nombre}</td>
                    <td>{teacher.apellido}</td>
                    <td>{teacher.tipoDocumento}</td>
                    <td>{teacher.documento}</td>
                    <td>{teacher.correo}</td>
                    <td>{teacher.genero}</td>
                    <td>{teacher.nacimiento}</td>
                    <td className='Actions'>
                      <button className='btn-edit' onClick={() => handleEdit(teacher.id)}><MdModeEdit /></button>
                      <button className='btn-delete' onClick={() => handleDelete(teacher.id)}><MdDelete /></button>
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
            <LabelInputEdit id="teacherApellido" texto="Apellido" eventoCambio={changeApellido} valorInicial={selectedTeacher.apellido}></LabelInputEdit>
            <SelectEdit id="teacherTipoDocumento" titulo="Tipo Documento" opciones={opcionesDocumento} eventoCambio={changeTipoDocumento} valorInicial={selectedTeacher.tipoDocumento} readOnly={true}></SelectEdit>
            <LabelInputEdit id='teacherDocumento' tipo="number" texto="Documento" eventoCambio={changeDocumento} valorInicial={selectedTeacher.documento} readOnly={true}></LabelInputEdit>
            <LabelInputEdit id='teacherEmail' tipo="email" texto="Correo" eventoCambio={changeCorreo} valorInicial={selectedTeacher.correo}></LabelInputEdit>
            <SelectEdit id="teacherGenero" titulo="Sexo" opciones={opcionesGenero} eventoCambio={changeGenero} valorInicial={selectedTeacher.genero}></SelectEdit>
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


