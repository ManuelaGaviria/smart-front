import { useContext } from "react";
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import ContenedorForms from '../../components/ContenedorForms';
import LabelInputEdit from "../../components/LabelInputEdit";
import Button from '../../components/Button';
import ButtonLink from '../../components/ButtonLink';
import { fetchBody } from '../../utils/fetch';
import GeneralContext from '../../context/GeneralContext';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from "../../components/Select";

function CreateAdmin() {
  const navigate = useNavigate();
    useEffect(() => {
        const verificar = async () => {
            const respuesta = await fetchBody('/usuarios/', 'POST', {rol: "superadministrador"});
            if (respuesta.exito === false) {
                navigate("/")
            }
        }
        verificar();
    }, [])
  
  const { name, changeName, apellido, changeApellido, tipoDocumento, changeTipoDocumento, documento, changeDocumento, correo, changeCorreo, genero, changeGenero, nacimiento, changeNacimiento, administrador, changeAdministrador } = useContext(GeneralContext);

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

  async function validate() {
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
      edadMinima.setFullYear(edadMinima.getFullYear() - 18); // Restar 18 años a la fecha actual
      
      if (fechaNacimiento >= new Date() || fechaNacimiento > edadMinima) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "La fecha de nacimiento no puede ser posterior a la fecha actual y el Administrador debe tener al menos 18 años.",
          customClass: {
            confirmButton: 'btn-color'
          },
          buttonsStyling: false
        });
      } else {
        const data = {
          nombre: name,
          apellido: apellido,
          tipoDocumento: tipoDocumento,
          documento: documento,
          correo: correo,
          genero: genero,
          nacimiento: nacimiento,
          rol: administrador
        };
        try {
          const respuesta = await fetchBody('/usuarios/agregar', 'POST', data);
          if (respuesta.exito) {
            Swal.fire({
              icon: "success",
              title: "Administrador creado con éxito!",
              customClass: {
                confirmButton: 'btn-color'
              },
              buttonsStyling: false
            });
            navigate("/GestionarAdmins");
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
            text: 'Error al procesar la solicitud para crear un Administrador',
            customClass: {
              confirmButton: 'btn-color'
            },
            buttonsStyling: false
          });
        }
      }
    }
  }

  return (
    <motion.div className="login-container"
      initial={{ opacity: 0, x: -1000 }} // Inicia desde la izquierda
      animate={{ opacity: 1, x: 0 }} // Animación hacia la derecha
      exit={{ opacity: 0, x: 1000 }} // Sale hacia la derecha
      transition={{ duration: 1 }}>
      <ContenedorForms>
        <h1>Crear Administrador</h1>
        <div className="InputContainer">
          <LabelInputEdit id="idName" texto="Nombre *" eventoCambio={changeName} ></LabelInputEdit>
          <LabelInputEdit id="idApellido" eventoCambio={changeApellido} texto="Apellidos *"></LabelInputEdit>
          <Select id="idTipoDocumento" titulo="Tipo Documento *" opciones={opcionesDocumento} eventoCambio={changeTipoDocumento}></Select>
          <LabelInputEdit id="idDocument" tipo="number" texto="Documento *" eventoCambio={changeDocumento}></LabelInputEdit>
          <LabelInputEdit id="idMail" tipo="email" texto="Correo *" eventoCambio={changeCorreo} ></LabelInputEdit>
          <Select id="idGenero" titulo="Género *" opciones={opcionesGenero} eventoCambio={changeGenero}></Select>
          <LabelInputEdit id="idDate" tipo="date" texto="Fecha Nacimiento *" eventoCambio={changeNacimiento}></LabelInputEdit>
          <Select id="idRol" titulo="Rol *" opciones={opcionesAdmin} eventoCambio={changeAdministrador}></Select>
        </div>
        <br />
        <Button eventoClick={validate} clase="Button">Crear</Button>

        <ButtonLink destino="/GestionarAdmins" clase="Button">Regresar</ButtonLink>
      </ContenedorForms>
    </motion.div>
  );
}

export default CreateAdmin;
