import { useContext } from "react";
import { motion} from 'framer-motion';
import ContenedorForms from '../components/ContenedorForms';
import LabelInput from '../components/LabelInput';
import Button from '../components/Button';
import ButtonLink from '../components/ButtonLink';
import RadioButton from '../components/RadioButton';
import { fetchBody } from '../utils/fetch';
import GeneralContext from "../context/GeneralContext";

function CreateStudent() {
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
        const respuesta = await fetchBody('/estudiantes/agregar', 'POST', data);
        console.log(respuesta);
        if (respuesta.exito) {
          changeName({ target: { value: '' } });
          changeDocument({ target: { value: '' } });
          changeCorreo({ target: { value: '' } });
          changeNacimiento({ target: { value: '' } });
          alert("Se agregó el estudiante con éxito");
          
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
            <h1>Crear Estudiante</h1>
          <div className="InputContainer">
            <LabelInput eventoCambio={changeName} texto="Nombre"></LabelInput>
            <LabelInput eventoCambio={changeDocument} tipo="number" texto="Documento"></LabelInput>
            <LabelInput eventoCambio={changeCorreo} tipo="email" texto="Correo"></LabelInput>
            <LabelInput eventoCambio={changeNacimiento} tipo="date" texto="Fecha Nacimiento"></LabelInput>
            <div>
                <label>Niveles Matriculados</label>
                <div className='niveles'>
                    <RadioButton id="opcion1" label="A1"/>
                    <RadioButton id="opcion2" label="A2"/>
                    <RadioButton id="opcion3" label="B1"/>
                    <RadioButton id="opcion4" label="B2"/>
                    <RadioButton id="opcion5" label="C1"/>
                </div> 
            </div>
          </div>
          <br />
          <Button eventoClick={validate} clase="Button">Crear</Button>
          <ButtonLink destino="/PrincipalStudent" clase="Button">Regresar</ButtonLink>
        </ContenedorForms>
    </motion.div>
  )
}

export default CreateStudent