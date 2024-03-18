import { useContext, useEffect } from "react";
import { motion } from 'framer-motion';
import ContenedorForms from '../components/ContenedorForms';
import LabelInput from '../components/LabelInput';
import Button from '../components/Button';
import ButtonLink from '../components/ButtonLink';
import { fetchBody } from '../utils/fetch';
import GeneralContext from '../context/GeneralContext';

function CreateTeacher() {
  const { name, changeName, document, changeDocument, correo, changeCorreo, nacimiento, changeNacimiento } = useContext(GeneralContext);

  async function validate() {
    if (name === "" || document === "" || correo === "") {
      alert("Por favor, llena todos los campos.");
    } else {
      const data = {
        nombre: name,
        documento: document,
        correo: correo,
        nacimiento: nacimiento
      };
      console.log(data);

      try {
        const respuesta = await fetchBody('/profesores/agregar', 'POST', data);
        console.log(respuesta);
        if (respuesta.exito) {
          changeName({ target: { value: '' } });
          changeDocument({ target: { value: '' } });
          changeCorreo({ target: { value: '' } });
          changeNacimiento({ target: { value: '' } });
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
      transition={{ duration: 2 }}>
      <ContenedorForms>
        <h1>Crear Profesor</h1>
        <div className="InputContainer">
          <LabelInput texto="Nombre" eventoCambio={changeName}></LabelInput>
          <LabelInput tipo="number" texto="Documento" eventoCambio={changeDocument}></LabelInput>
          <LabelInput tipo="email" texto="Correo" eventoCambio={changeCorreo}></LabelInput>
          <LabelInput tipo="date" texto="Fecha Nacimiento" eventoCambio={changeNacimiento}></LabelInput>
        </div>
        <br />
        <Button eventoClick={validate} clase="Button">Crear</Button>

        <ButtonLink destino="/PrincipalTeacher" clase="Button">Regresar</ButtonLink>
      </ContenedorForms>
    </motion.div>
  );
}

export default CreateTeacher;
