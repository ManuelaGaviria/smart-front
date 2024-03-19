import { useContext, useEffect } from "react";
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
      alert("Por favor, llena todos los campos.");
    } else {
      const data = {
        nombre: name,
        documento: documento,
        correo: correo,
        nacimiento: nacimiento
      };
      console.log(data);

      try {
        const respuesta = await fetchBody('/profesores/agregar', 'POST', data);
        console.log(respuesta);
        if (respuesta.exito) {
          changeName({ target: { value: '' } });
          changeDocumento({ target: { value: '' } });
          changeCorreo({ target: { value: '' } });
          changeNacimiento({ target: { value: '' } });
          document.getElementById("idName").value = "";
          document.getElementById("idDocument").value = "";
          document.getElementById("idMail").value = "";
          document.getElementById("idDate").value = "";
          alert("Se agregó el profesor con éxito");
          
        } else {
          alert('Error: ' + respuesta.error);
        }
      } catch (error) {
        alert('Error al procesar la solicitud');
        console.error('Error:', error);
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
