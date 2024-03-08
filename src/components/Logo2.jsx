import { motion} from 'framer-motion';

function Logo2({children}) {
  return (
    <motion.div 
    className='logo'
    initial={{opacity:0, x:-200}} 
    animate={{opacity:1, x:-350}} 
    exit={{opacity:0, x:200}}
    transition={{duration:2, delay:0.5}}
    >
        {children}
    </motion.div>
  )
}

export default Logo2