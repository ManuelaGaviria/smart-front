import { motion} from 'framer-motion';

function Logo2({children}) {
  return (
    <motion.div
      className='logo2'
      initial={{ opacity: 0, y: 100 }} // Inicia desde abajo (puedes ajustar la distancia según tus necesidades)
      animate={{ opacity: 1, y: -100 }} // Animación de abajo hacia arriba
      exit={{ opacity: 0, y: -100 }} // Sale hacia abajo
      transition={{ duration: 1, delay: 0.5 }}
      
    >
      {children}
    </motion.div>
  )
}

export default Logo2