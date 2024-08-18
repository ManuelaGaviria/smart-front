import {motion} from 'framer-motion';

function ContentCard({ data }) {
  return (
    <motion.div
        key={'contentCard' + data.id}
        className="card"
        initial={{opacity: 0, x: -1000}}
        animate={{opacity: 1, x: 0}}
        exit={{opacity: 0, x: -1000, transition:{duration: 0.5, delay: 0}}}
        transition={{duration: 0.5}}>
        <h2>{data.pregunta}</h2>
        <label>{data.respuesta1}</label>
        <br />
        <label>{data.respuesta2}</label>
        <br />
        <label>{data.respuesta3}</label>
        <br />
        <label>{data.respuesta4}</label>
        <br />
    </motion.div>
  )
}

export default ContentCard