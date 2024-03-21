import { useContext, useEffect } from "react";
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import ContenedorForms from '../components/ContenedorForms';
import LabelInput from '../components/LabelInput';
import LabelInputEdit from "../components/LabelInputEdit";
import Button from '../components/Button';
import ButtonLink from '../components/ButtonLink';
import { fetchBody } from '../utils/fetch';
import GeneralContext from '../context/GeneralContext';

function CreateTeacher() {
  const { name, changeName, documento, changeDocumento, correo, changeCorreo, nacimiento, changeNacimiento } = useContext(GeneralContext);

  async function validate() {
    if (name === "" || documento === "" || correo === "") {
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
      //poner validaciones para el correo, que tenga el arroba, y mirar como verificar si es un correo válido
      const data = {
        nombre: name,
        documento: documento,
        correo: correo,
        nacimiento: nacimiento
      };
      try {
        const respuesta = await fetchBody('/profesores/agregar', 'POST', data);
        if (respuesta.exito) {
          changeName({ target: { value: '' } });
          changeDocumento({ target: { value: '' } });
          changeCorreo({ target: { value: '' } });
          changeNacimiento({ target: { value: '' } });
          document.getElementById("idName").value = "";
          document.getElementById("idDocument").value = "";
          document.getElementById("idMail").value = "";
          document.getElementById("idDate").value = "";
          Swal.fire({
            icon: "success",
            title: "Profesor creado con éxito!",
            customClass: {
              confirmButton: 'btn-color'
            },
            buttonsStyling: false
          });
          
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
          text: 'Error al procesar la solicitud para crear un profesor',
        });
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
        <h1>Crear Profesor</h1>
        <div className="InputContainer">
          <LabelInputEdit id="idName" texto="Nombre" eventoCambio={changeName} ></LabelInputEdit>
          <LabelInputEdit id="idDocument" tipo="number" texto="Documento" eventoCambio={changeDocumento}></LabelInputEdit>
          <LabelInputEdit id="idMail" tipo="email" texto="Correo" eventoCambio={changeCorreo} ></LabelInputEdit>
          <LabelInputEdit id="idDate" tipo="date" texto="Fecha Nacimiento" eventoCambio={changeNacimiento}></LabelInputEdit>
        </div>
        <br />
        <Button eventoClick={validate} clase="Button">Crear</Button>

        <ButtonLink destino="/PrincipalTeacher" clase="Button">Regresar</ButtonLink>
      </ContenedorForms>
    </motion.div>
  );
}

export default CreateTeacher;
