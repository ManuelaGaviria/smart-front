import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Logo3 from '../../components/Logo3';
import { motion } from 'framer-motion';
import FullScreenCard from '../../components/FullScreenCard';
import { fetchBody } from '../../utils/fetch';
import GeneralContext from '../../context/GeneralContext';
import { useContext } from "react";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import Button from '../../components/Button';
import ContenedorForms from '../../components/ContenedorForms';
import ButtonLink from '../../components/ButtonLink';
import LabelInputEdit from '../../components/LabelInputEdit';
import { useNavigate } from 'react-router-dom';
import SelectEdit from '../../components/SelectEdit';

function ActionsAdmin() {
  const navigate = useNavigate();
  useEffect(() => {
    const verificar = async () => {
      const respuesta = await fetchBody('/usuarios/', 'POST', { rol: "superadministrador" });
      if (respuesta.exito === false) {
        navigate("/")
      }
    }
    verificar();
  }, [])

  const { changeName, changeApellido, changeTipoDocumento, changeDocumento, changeCorreo, changeGenero, changeNacimiento, changeAdministrador } = useContext(GeneralContext);
  const [admins, setAdmin] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [nuevoRol, setNuevoRol] = useState(""); // Nuevo estado para el nuevo rol
  const [backgroundOpacity] = useState(0.5);

  const opcionesDocumento = [
    { nombre: 'CC', id: 2 },
    { nombre: 'CE', id: 3 }
  ];

  const opcionesGenero = [
    { nombre: 'Femenino', id: 1 },
    { nombre: 'Masculino', id: 2 }
  ];

  const opcionesAdmin = [
    { nombre: 'administrador', id: 1 },
    { nombre: 'superadministrador', id: 2 }
  ];

  useEffect(() => {
    listAdmins();
  }, []);

  const openEditModal = (admin) => {
    setSelectedAdmin(admin);
    setNuevoRol(admin.rol); // Establecer el rol actual como valor inicial del nuevo rol
    setEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
  };

  async function listAdmins() {
    try {
      const respuesta = await fetchBody('/usuarios/listar', 'POST', { rol: ['administrador', 'superadministrador'] })
      if (respuesta.exito) {
        setAdmin(respuesta.lista)
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
        text: 'Error al procesar la solicitud para listar los administradores',
        customClass: {
          confirmButton: 'btn-color'
        },
        buttonsStyling: false
      });
    }
  }

  async function handleEdit(id) {
    const adminToEdit = admins.find(admin => admin.id === id);
    if (adminToEdit) {
      openEditModal(adminToEdit);
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: 'Administrador no encontrado',
        customClass: {
          confirmButton: 'btn-color'
        },
        buttonsStyling: false
      });
    }
  }

  async function editAdmin(id) {
    const name = document.getElementById('adminName').value;
    const apellido = document.getElementById('adminApellido').value;
    const tipoDocumento = document.getElementById('adminTipoDocumento').value;
    const documento = document.getElementById('adminDocumento').value;
    const correo = document.getElementById('adminEmail').value;
    const genero = document.getElementById('adminGenero').value;
    const nacimiento = document.getElementById('adminDate').value;
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
          text: "La fecha de nacimiento no puede ser posterior a la fecha actual y el admin debe tener al menos 18 años.",
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
          status: selectedAdmin.status,
          rol: selectedAdmin.rol, // Rol actual
          nuevoRol: nuevoRol // Nuevo rol
        };
        try {
          const respuesta = await fetchBody('/usuarios/editar', 'PUT', data)
          if (respuesta.exito) {
            Swal.fire({
              icon: "success",
              title: "Se actualizó administrador con éxito!",
              customClass: {
                confirmButton: 'btn-color'
              },
              buttonsStyling: false
            });
            handleCloseModal();
            await listAdmins();
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
  }

  const handleToggle = (id, currentState) => {
    const action = currentState ? "inactivar" : "activar";
    const confirmationText = currentState
      ? "¿Estás seguro que deseas inactivar a este administrador?"
      : "¿Estás seguro que deseas activar a este administrador?";

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
      rol: "administrador",
      isActive
    };

    try {
      const respuesta = await fetchBody('/usuarios/activar-inactivar', 'POST', data);
      if (respuesta.exito) {
        Swal.fire({
          icon: "success",
          title: isActive ? "Administrador activado con éxito!" : "Administrador inactivado con éxito!",
          customClass: {
            confirmButton: 'btn-color',

          },
          buttonsStyling: false
        });
        await listAdmins();
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
        text: "Error al actualizar el estado del administrador",
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
                <th style={{ width: '250px' }}>Rol</th>
                <th style={{ width: '250px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td>{admin.nombre}</td>
                  <td>{admin.apellido}</td>
                  <td>{admin.tipoDocumento}</td>
                  <td>{admin.documento}</td>
                  <td>{admin.correo}</td>
                  <td>{admin.genero}</td>
                  <td>{admin.nacimiento}</td>
                  <td>{admin.rol}</td>
                  <td className='Actions'>
                    <button className='btn-edit' onClick={() => handleEdit(admin.id)}><MdModeEdit /></button>
                    <div class="checkbox-con">
                      <input
                        id={`checkbox-${admin.id}`}
                        type="checkbox"
                        checked={admin.isActive}
                        onChange={() => handleToggle(admin.id, admin.isActive)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ButtonLink destino="/GestionarAdmins" clase="ButtonRegresar">Regresar</ButtonLink>
      </FullScreenCard>
      {editModalOpen && (
        <>
          <div
            className="BackgroundOverlay"
            style={{ opacity: backgroundOpacity }}
          />
          <ContenedorForms>
            <h1>Editar Administrador</h1>
            <div className="InputContainer">
              <LabelInputEdit id='adminName' texto="Nombre" eventoCambio={changeName} valorInicial={selectedAdmin.nombre}></LabelInputEdit>
              <LabelInputEdit id="adminApellido" texto="Apellido" eventoCambio={changeApellido} valorInicial={selectedAdmin.apellido}></LabelInputEdit>
              <SelectEdit id="adminTipoDocumento" titulo="Tipo Documento" opciones={opcionesDocumento} eventoCambio={changeTipoDocumento} valorInicial={selectedAdmin.tipoDocumento} readOnly={true}></SelectEdit>
              <LabelInputEdit id='adminDocumento' tipo="number" texto="Documento" eventoCambio={changeDocumento} valorInicial={selectedAdmin.documento} readOnly={true}></LabelInputEdit>
              <LabelInputEdit id='adminEmail' tipo="email" texto="Correo" eventoCambio={changeCorreo} valorInicial={selectedAdmin.correo}></LabelInputEdit>
              <SelectEdit id="adminGenero" titulo="Sexo" opciones={opcionesGenero} eventoCambio={changeGenero} valorInicial={selectedAdmin.genero}></SelectEdit>
              <LabelInputEdit id='adminDate' tipo="date" texto="Fecha Nacimiento" eventoCambio={changeNacimiento} valorInicial={selectedAdmin.nacimiento}></LabelInputEdit>
              <SelectEdit
                id="adminRol"
                titulo="Rol"
                opciones={opcionesAdmin}
                eventoCambio={(e) => setNuevoRol(e.target.value)}
                valorInicial={selectedAdmin.rol} // Aquí debería ser selectedAdmin.rol
              ></SelectEdit>

            </div>
            <br />
            <Button clase="Button" eventoClick={() => editAdmin(selectedAdmin.id)}>Editar</Button>
            <Button clase="Button" eventoClick={handleCloseModal}>Regresar</Button>
          </ContenedorForms>
        </>
      )}
    </motion.div>
  );
}

export default ActionsAdmin;


