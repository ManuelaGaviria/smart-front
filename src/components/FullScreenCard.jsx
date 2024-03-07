import {motion} from 'framer-motion';
import { useEffect } from 'react';

function FullscreenCard({ children, clase}) {

    useEffect(() => {
        document.body.style.backgroundColor = 'rgb(40, 0, 80)'
      }, [])

  return (
    <motion.div
    initial={{maxWidth: '0vw', opacity: 0}}
    animate={{maxWidth: '100vw', opacity: 1}}
    exit={{maxWidth: '0vw', opacity: 0}}
    transition={{duration: 1}}
    className={clase}>
        <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0, transition: {duration: 0.3, delay: 0}}}
        transition={{duration: 0.5, delay: 1}}>
            {children}
        </motion.div>
    </motion.div>
  )
}

FullscreenCard.defaultProps = {
    clase: "fullscreenCard"
}

export default FullscreenCard