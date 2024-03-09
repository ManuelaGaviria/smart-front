import Logo3 from '../components/Logo3';
import { motion} from 'framer-motion';
import FullScreenCard from '../components/FullScreenCard';

function ActionsTeacher() {
  return (
    <motion.div 
    className='ContainerFull'
    initial={{ opacity: 0, x: 1000 }} // Inicia desde la derecha
    animate={{ opacity: 1, x: 0 }} // Animación hacia la izquierda
    exit={{ opacity: 0, x: -1000 }} // Sale hacia la izquierda
    transition={{ duration: 2 }}>
        <Logo3></Logo3>
        <FullScreenCard></FullScreenCard>
    </motion.div>
  )
}

export default ActionsTeacher