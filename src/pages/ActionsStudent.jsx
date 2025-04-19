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
import RadioButton from '../components/RadioButton';
import SelectEdit from '../components/SelectEdit';

function ActionsStudent() {
  const navigate = useNavigate();
  useEffect(() => {
    const verificar = async () => {
      const respuesta = await fetchBody('/usuarios/', 'POST', { rol: "administrador" });
      if (respuesta.exito === false) {
        navigate("/")
      }
    }
    verificar();
  }, [])

  const { changeName, changeApellido, changeTipoDocumento, changeDocumento, changeCorreo, changeGenero, changeNacimiento } = useContext(GeneralContext);
  const [students, setStudents] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [backgroundOpacity] = useState(0.5);

  const opcionesDocumento = [
    { nombre: 'TI', id: 1 },
    { nombre: 'CC', id: 2 },
    { nombre: 'CE', id: 3 }
  ];

  const opcionesGenero = [
    { nombre: 'Femenino', id: 1 },
    { nombre: 'Masculino', id: 2 }
  ];

  const [selectedLevels, setSelectedLevels] = useState({});

  const handleLevelChange = (id) => {
    setSelectedLevels(prevLevels => {
      // Copiamos el objeto de niveles previo
      const updatedLevels = { ...prevLevels };
      // Si el nivel ya está seleccionado, lo eliminamos
      if (updatedLevels[id]) {
        updatedLevels[id] = false;
      } else {
        // Si el nivel no está seleccionado, lo agregamos o lo marcamos como seleccionado
        updatedLevels[id] = true;
      }
      // Devolvemos el objeto de niveles actualizado
      return updatedLevels;
    });
  };



  useEffect(() => {
    listStudents();
  }, []);

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setSelectedLevels(student.niveles);
    setEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
  };

  async function listStudents() {
    try {
      const respuesta = await fetchBody('/usuarios/listar', 'POST', { rol: "estudiante" })
      if (respuesta.exito) {
        setStudents(respuesta.lista);
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
        text: 'Error al procesar la solicitud para listar los estudiantes',
        customClass: {
          confirmButton: 'btn-color'
        },
        buttonsStyling: false
      });
    }
  }

  async function handleEdit(id) {
    const studentToEdit = students.find(student => student.id === id);
    if (studentToEdit) {
      openEditModal(studentToEdit);
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: 'Estudiante no encontrado',
        customClass: {
          confirmButton: 'btn-color'
        },
        buttonsStyling: false
      });
    }
  }

  async function editStudent(id) {
    const name = document.getElementById('studentName').value;
    const apellido = document.getElementById('studentApellido').value;
    const tipoDocumento = document.getElementById('studentTipoDocumento').value;
    const documento = document.getElementById('studentDocument').value;
    const correo = document.getElementById('studentMail').value;
    const genero = document.getElementById('studentGenero').value;
    const nacimiento = document.getElementById('studentDate').value;
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
      edadMinima.setFullYear(edadMinima.getFullYear() - 8); // Restar 8 años a la fecha actual

      if (fechaNacimiento >= new Date() || fechaNacimiento > edadMinima) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "La fecha de nacimiento no puede ser posterior a la fecha actual y el estudiante debe tener al menos 8 años.",
          customClass: {
            confirmButton: 'btn-color'
          },
          buttonsStyling: false
        });
      } else {
        const data = {
          id: id,
          nombre: name,
          apellido: apellido,
          tipoDocumento: tipoDocumento,
          documento: documento,
          correo: correo,
          genero: genero,
          nacimiento: nacimiento,
          rol: "estudiante",
          niveles: selectedLevels
        };
        try {
          const respuesta = await fetchBody('/usuarios/editar', 'PUT', data);
          if (respuesta.exito) {
            Swal.fire({
              icon: "success",
              title: "Se actualizó estudiante con éxito!",
              customClass: {
                confirmButton: 'btn-color'
              },
              buttonsStyling: false
            });
            handleCloseModal();
            await listStudents();
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

  const handleToggle = (id, currentState) => {
    const action = currentState ? "inactivar" : "activar";
    const confirmationText = currentState
      ? "¿Estás seguro que deseas inactivar a este estudiante?"
      : "¿Estás seguro que deseas activar a este estudiante?";

    Swal.fire({
      icon: "warning",
      title: `Confirmar ${action}`,
      text: confirmationText,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: "btn-color",
        cancelButton: 'btn-color-cancel'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        handleToggleActive(id, !currentState);
      }
    });
  };

  async function handleToggleActive(id, isActive) {
    console.log('isActive :>> ', isActive);
    const data = {
      id,
      rol: "estudiante",
      isActive
    };

    try {
      const respuesta = await fetchBody('/usuarios/activar-inactivar', 'POST', data);
      if (respuesta.exito) {
        Swal.fire({
          icon: "success",
          title: isActive ? "Estudiante activado con éxito!" : "Estudiante inactivado con éxito!",
          customClass: {
            confirmButton: 'btn-color',

          },
          buttonsStyling: false
        });
        await listStudents();
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
        text: "Error al actualizar el estado del estudiante",
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
                <th style={{ width: '200px' }}>Nombre</th>
                <th style={{ width: '200px' }}>Apellidos</th>
                <th style={{ width: '200px' }}>Tipo Documento</th>
                <th style={{ width: '200px' }}>Documento</th>
                <th style={{ width: '200px' }}>Correo</th>
                <th style={{ width: '200px' }}>Sexo</th>
                <th style={{ width: '200px' }}>Fecha de Nacimiento</th>
                <th style={{ width: '200px' }}>Niveles Matriculados</th>
                <th style={{ width: '200px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.nombre}</td>
                  <td>{student.apellido}</td>
                  <td>{student.tipoDocumento}</td>
                  <td>{student.documento}</td>
                  <td>{student.correo}</td>
                  <td>{student.genero}</td>
                  <td>{student.nacimiento}</td>
                  <td>
                    {Object.keys(student.niveles).map((nivel) => (
                      student.niveles[nivel] && <div key={nivel} style={{ display: 'inline-block', marginRight: '3px' }}>{nivel}</div>
                    ))}
                  </td>
                  <td className='Actions'>
                    <button className='btn-edit' onClick={() => handleEdit(student.id)}><MdModeEdit /></button>
                    <div class="checkbox-con">
                      <input
                        id={`checkbox-${student.id}`}
                        type="checkbox"
                        checked={student.isActive}
                        onChange={() => handleToggle(student.id, student.isActive)}
                      />
                    </div>
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
              <LabelInputEdit id="studentApellido" texto="Apellido" eventoCambio={changeApellido} valorInicial={selectedStudent.apellido}></LabelInputEdit>
              <SelectEdit id="studentTipoDocumento" titulo="Tipo Documento" opciones={opcionesDocumento} eventoCambio={changeTipoDocumento} valorInicial={selectedStudent.tipoDocumento} readOnly={true}></SelectEdit>
              <LabelInputEdit id="studentDocument" tipo="number" texto="Documento" eventoCambio={changeDocumento} valorInicial={selectedStudent.documento} readOnly={true}></LabelInputEdit>
              <LabelInputEdit id="studentMail" tipo="email" texto="Correo" eventoCambio={changeCorreo} valorInicial={selectedStudent.correo}></LabelInputEdit>
              <SelectEdit id="studentGenero" titulo="Sexo" opciones={opcionesGenero} eventoCambio={changeGenero} valorInicial={selectedStudent.genero}></SelectEdit>
              <LabelInputEdit id="studentDate" tipo="date" texto="Fecha Nacimiento" eventoCambio={changeNacimiento} valorInicial={selectedStudent.nacimiento}></LabelInputEdit>
              <label>Niveles Matriculados</label>
              <div className='niveles'>
                <RadioButton id="A1" label="A1" onChange={handleLevelChange} checked={selectedLevels["A1"]} />
                <RadioButton id="A2" label="A2" onChange={handleLevelChange} checked={selectedLevels["A2"]} />
                <RadioButton id="B1" label="B1" onChange={handleLevelChange} checked={selectedLevels["B1"]} />
                <RadioButton id="B2" label="B2" onChange={handleLevelChange} checked={selectedLevels["B2"]} />
                <RadioButton id="C1" label="C1" onChange={handleLevelChange} checked={selectedLevels["C1"]} />
              </div>
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