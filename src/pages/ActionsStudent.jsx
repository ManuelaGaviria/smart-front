import React, { useState, useEffect } from 'react';
import Logo3 from '../components/Logo3';
import { motion} from 'framer-motion';
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

function ActionsStudent() {
  const { name, changeName, documento, changeDocumento, correo, changeCorreo, nacimiento, changeNacimiento } = useContext(GeneralContext);
  const [students, setStudents] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.5);

  useEffect(() => {
    listStudents();
  }, []);

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
  };

  async function listStudents() {
    try {
      const respuesta = await fetchGet('/estudiantes/');
      if (respuesta.exito) {
        setStudents(respuesta.lista)
      } else {
        alert('Error: ' + respuesta.error);
      }
    } catch (error) {
      alert('Error al procesar la solicitud');
      console.error('Error:', error);
    }
  }

  async function handleEdit(id) {
    const studentToEdit = students.find(student => student.id === id);
    if (studentToEdit) {
      openEditModal(studentToEdit);
    } else {
      console.log('Estudiante no encontrado');
    }
  }

  async function editStudent(id) {
    const name = document.getElementById('studentName').value;
    const documento = document.getElementById('studentDocumento').value;
    const correo = document.getElementById('studentEmail').value;
    const nacimiento = document.getElementById('studentDate').value;
    if (name === "" || documento === "" || correo === "" ){
        alert("Por favor, llena todos los campos.");
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
            const respuesta = await fetchBody ('/estudiantes/editar','PUT',data) 
            console.log(respuesta);
            if (respuesta.exito){
                alert("Se editó el estudiante con éxito");
                handleCloseModal();
                await listStudents();
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
    // Mostrar una alerta de confirmación antes de eliminar al estudiante
    const confirmacion = window.confirm("¿Estás seguro de eliminar este estudiante?");
    
    // Verificar si el usuario confirmó la eliminación
    if (confirmacion) {
      const data = { id: id };
      try {
        const respuesta = await fetchBody('/estudiantes/eliminar', 'DELETE', data );
        console.log(respuesta);
        console.log("respuesta.exito= " + respuesta.exito)
        if (respuesta.exito){
          alert("Se eliminó el estudiante con éxito");
          await listStudents();
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
    initial={{ opacity: 0, x: 1000 }} // Inicia desde la derecha
    animate={{ opacity: 1, x: 0 }} // Animación hacia la izquierda
    exit={{ opacity: 0, x: -1000 }} // Sale hacia la izquierda
    transition={{ duration: 1 }}>
        <Logo3></Logo3>
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
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.nombre}</td>
                    <td>{student.documento}</td>
                    <td>{student.correo}</td>
                    <td>{student.nacimiento}</td>
                    <td className='Actions'>
                      <button onClick={() => handleEdit(student.id)}><MdModeEdit /></button>
                      <button onClick={() => handleDelete(student.id)}><MdDelete /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
        <ButtonLink destino="/PrincipalStudent" clase="ButtonRegresar">Regresar</ButtonLink>
        </FullScreenCard>
        {editModalOpen && (
      <>
        <div
          className="BackgroundOverlay"
          style={{ opacity: backgroundOpacity }}
        />
        <ContenedorForms>
          <h1>Editar Estudiante</h1>
          <div className="InputContainer">
            <LabelInputEdit id="studentName" texto="Nombre" eventoCambio={changeName} valorInicial={selectedStudent.nombre}></LabelInputEdit>
            <LabelInputEdit id="studentDocument" tipo="number" texto="Documento" eventoCambio={changeDocumento} valorInicial={selectedStudent.documento}></LabelInputEdit>
            <LabelInputEdit id="studentMail" tipo="email" texto="Correo" eventoCambio={changeCorreo} valorInicial={selectedStudent.correo}></LabelInputEdit>
            <LabelInputEdit id="studentDate" tipo="date" texto="Fecha Nacimiento" eventoCambio={changeNacimiento} valorInicial={selectedStudent.nacimiento}></LabelInputEdit>
          </div>
          <br />
          <Button clase="Button" eventoClick={() => editStudent(selectedStudent.id)}>Editar</Button>
          <Button clase="Button" eventoClick={handleCloseModal}>Regresar</Button>
        </ContenedorForms>
      </>
    )}
    </motion.div>
  )
}

export default ActionsStudent