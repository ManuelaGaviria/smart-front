import React, { useState, useEffect } from 'react';
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

function ActionsTeacher() {
  const { name, changeName, documento, changeDocumento, correo, changeCorreo, nacimiento, changeNacimiento } = useContext(GeneralContext);
  const [teachers, setTeachers] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.5);

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
        alert('Error: ' + respuesta.error);
      }
    } catch (error) {
      alert('Error al procesar la solicitud');
      console.error('Error:', error);
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
    if (name === "" || documento === "" || correo === "") {
      alert ("Ningún campo puede estar vacio")
    } else {

      const data = {
        id: id,
        nombre: name,
        documento: documento,
        correo: correo,
        nacimiento: nacimiento
      }
      console.log(data)

      try {
          const respuesta = await fetchBody ('/profesores/editar','PUT',data) 
          console.log(respuesta);
          if (respuesta.exito){
              alert("Se editó el profesor con éxito");
              handleCloseModal();
              await listTeachers();
          }
          else {
              alert('Error: ' + respuesta.error)
          }
      } catch (error) {
          alert('Error al procesar la solicitud')
          console.error('Error:', error)
      }
    }  
  }


  async function handleDelete(id) {
    // Mostrar una alerta de confirmación antes de eliminar al profesor
    const confirmacion = window.confirm("¿Estás seguro de eliminar este profesor?");
    
    // Verificar si el usuario confirmó la eliminación
    if (confirmacion) {
      const data = { id: id };
      try {
        const respuesta = await fetchBody('/profesores/eliminar', 'DELETE', data );
        console.log(respuesta);
        console.log("respuesta.exito= " + respuesta.exito)
        if (respuesta.exito){
          alert("Se eliminó el profesor con éxito");
          await listTeachers();
        } else {
          alert('Error: ' + respuesta.error)
        }
      } catch (error) {
        alert('Error al procesar la solicitud')
        console.error('Error:', error)
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


