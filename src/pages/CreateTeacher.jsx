import { motion} from 'framer-motion';
import ContenedorForms from '../components/ContenedorForms';
import LabelInput from '../components/LabelInput';
import Button from '../components/Button';
import ButtonLink from '../components/ButtonLink';

function CreateTeacher() {
  return (
    <motion.div className="login-container"
    initial={{ opacity: 0, x: -1000 }} // Inicia desde la izquierda
    animate={{ opacity: 1, x: 0 }} // Animación hacia la derecha
    exit={{ opacity: 0, x: 1000 }} // Sale hacia la derecha
    transition={{ duration: 2 }}>
        <ContenedorForms>
            <h1>Crear Profesor</h1>
          <div className="InputContainer">
            <LabelInput texto="Nombre"></LabelInput>
            <LabelInput tipo="number" texto="Documento"></LabelInput>
            <LabelInput tipo="email" texto="Correo"></LabelInput>
            <LabelInput tipo="date" texto="Fecha Nacimiento"></LabelInput>
          </div>
          <br />
          <Button clase="Button">Crear</Button>
          <ButtonLink destino="/PrincipalTeacher" clase="Button">Regresar</ButtonLink>
        </ContenedorForms>
    </motion.div>
  )
}

export default CreateTeacher