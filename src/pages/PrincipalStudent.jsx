import Logo2 from '../components/Logo2';
import { motion} from 'framer-motion';
import { PiStudentBold } from "react-icons/pi";
import CircleImage from '../components/CircleImage';
import ButtonLink from '../components/ButtonLink';

function PrincipalStudent() {
  return (
    <motion.div 
    className='AdminContainer'
    initial={{ opacity: 0, x: 1000 }} // Inicia desde la derecha
    animate={{ opacity: 1, x: 0 }} // Animación hacia la izquierda
    exit={{ opacity: 0, x: -1000 }} // Sale hacia la izquierda
    transition={{ duration: 2 }}>
      <CircleImage icon={PiStudentBold}></CircleImage>
      <div className='logoAdminContainer'>
        <Logo2></Logo2>
      </div>
      <motion.div
      className='contentAdminContainer'
      initial={{ opacity: 0, y: -500 }} // Inicia desde abajo (puedes ajustar la distancia según tus necesidades)
      animate={{ opacity: 1, y: -50 }} // Animación de arriba hacia abajo
      exit={{ opacity: 0, y: 500 }} // Sale hacia abajo
      transition={{ duration: 2 }}
      > 
        <div className='ButtonsAdminContainer'>
          <h1 className='tituloPrincipal'>Estudiantes</h1>
          <div className='ButtonContainer'>
            <ButtonLink destino="/CreateStudent" clase="Button2">Crear Estudiante</ButtonLink>
            <ButtonLink destino="/ActionsStudent" clase="Button2">Ver Estudiantes</ButtonLink>
            <ButtonLink destino="/Admin" clase="Button2">Regresar</ButtonLink>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default PrincipalStudent