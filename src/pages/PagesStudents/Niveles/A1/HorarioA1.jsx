
import Logo3 from '../../../../components/Logo3';
import { motion } from 'framer-motion';
import FullscreenCard from '../../../../components/FullScreenCard';
import ButtonLink from '../../../../components/ButtonLink';

function HorarioA1() {
    return (
        <motion.div
            className='ContainerFull'
            initial={{ opacity: 0, x: 1000 }} // Inicia desde la derecha
            animate={{ opacity: 1, x: 0 }} // Animación hacia la izquierda
            exit={{ opacity: 0, x: -1000 }} // Sale hacia la izquierda
            transition={{ duration: 1 }}>
            <Logo3></Logo3>
            <FullscreenCard>
            <div className='CenterTable'>
                <table className='Table'>
                    <thead>
                        <tr>
                            <th style={{ width: '200px' }}>Día</th>
                            <th style={{ width: '200px' }}>Hora</th>
                            <th style={{ width: '200px' }}>Descripcion</th>
                            <th style={{ width: '200px' }}>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Miércoles 19 junio 2024</td>
                            <td>10:30</td>
                            <td>Clase 1</td>
                            <td>Pendiente</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <ButtonLink destino="/A1" clase="ButtonRegresar">Regresar</ButtonLink>
            </FullscreenCard>
        </motion.div>
    )
}

export default HorarioA1