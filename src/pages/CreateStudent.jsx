import { useContext } from "react";
import Swal from 'sweetalert2';
import { motion} from 'framer-motion';
import ContenedorForms from '../components/ContenedorForms';
import LabelInputEdit from "../components/LabelInputEdit";
import Button from '../components/Button';
import ButtonLink from '../components/ButtonLink';
import RadioButton from '../components/RadioButton';
import { fetchBody } from '../utils/fetch';
import GeneralContext from "../context/GeneralContext";

function CreateStudent() {
  const { name, changeName, documento, changeDocumento, correo, changeCorreo, nacimiento, changeNacimiento } = useContext(GeneralContext);

  async function validate() {
    if (name === "" || documento === "" || correo === "" || nacimiento === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor llena todos los campos.",
        customClass: {
          confirmButton: 'btn-color'
        },
        buttonsStyling: false
      });
    } else {
      const data = {
        nombre: name,
        documento: documento,
        correo: correo,
        nacimiento: nacimiento
      };
      try {
        const respuesta = await fetchBody('/estudiantes/agregar', 'POST', data);
        if (respuesta.exito) {
          changeName({ target: { value: '' } });
          changeDocumento({ target: { value: '' } });
          changeCorreo({ target: { value: '' } });
          changeNacimiento({ target: { value: '' } });
          document.getElementById("idNameStudent").value = "";
          document.getElementById("idDocumentStudent").value = "";
          document.getElementById("idMailStudent").value = "";
          document.getElementById("idDateStudent").value = "";
          Swal.fire({
            icon: "success",
            title: "Estudiante creado con éxito!",
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
          text: 'Error al procesar la solicitud para crear un estudiante',
          customClass: {
            confirmButton: 'btn-color'
          },
          buttonsStyling: false
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
            <h1>Crear Estudiante</h1>
          <div className="InputContainer">
            <LabelInputEdit id="idNameStudent" eventoCambio={changeName} texto="Nombre"></LabelInputEdit>
            <LabelInputEdit id="idDocumentStudent" eventoCambio={changeDocumento} tipo="number" texto="Documento"></LabelInputEdit>
            <LabelInputEdit id="idMailStudent" eventoCambio={changeCorreo} tipo="email" texto="Correo"></LabelInputEdit>
            <LabelInputEdit id="idDateStudent" eventoCambio={changeNacimiento} tipo="date" texto="Fecha Nacimiento"></LabelInputEdit>
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