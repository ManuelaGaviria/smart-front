import LogoutButton from "../../../../components/LogoutButton";
import Logo2 from "../../../../components/Logo2";
import { motion} from 'framer-motion';
import ButtonLink from "../../../../components/ButtonLink";

function ExamenEscritoB2() {
  return (
    <motion.div 
    className='AdminContainer'
    initial={{ opacity: 0, x: 1000 }} // Inicia desde la derecha
    animate={{ opacity: 1, x: 0 }} // Animación hacia la izquierda
    exit={{ opacity: 0, x: -1000 }} // Sale hacia la izquierda
    transition={{ duration: 1 }}>
      <LogoutButton></LogoutButton>
      <div className='logoAdminContainer'>
        <Logo2></Logo2>
      </div>
      <motion.div
      className='contentAdminContainer'
      initial={{ opacity: 0, y: -500 }} // Inicia desde abajo (puedes ajustar la distancia según tus necesidades)
      animate={{ opacity: 1, y: -50 }} // Animación de arriba hacia abajo
      exit={{ opacity: 0, y: 500 }} // Sale hacia abajo
      transition={{ duration: 1 }}
      > 
        <div className='ButtonsAdminContainer'>
          <h1>Examen Escrito B2</h1>
          <p>Selecciona el examen a realizar</p>
          <div className=''>
            <ButtonLink destino="/Unit1&2" clase="circleLevels">Units 1&2</ButtonLink>
            <ButtonLink destino="/Unit3&4" clase="circleLevels">Units 3&4</ButtonLink>
            <ButtonLink destino="/Unit5&6" clase="circleLevels">Units 5&6</ButtonLink>
            <br />
            <br />
            <ButtonLink destino="/B2" clase="Button2">Regresar</ButtonLink>
          </div>
        </div> 
      </motion.div>
    </motion.div>
  )
}

export default ExamenEscritoB2