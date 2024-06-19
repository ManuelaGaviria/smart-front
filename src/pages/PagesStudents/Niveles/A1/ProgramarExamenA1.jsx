
import Logo3 from '../../../../components/Logo3';
import { motion } from 'framer-motion';
import FullscreenCard from '../../../../components/FullScreenCard';
import ButtonLink from '../../../../components/ButtonLink';

function ProgramarExamenA1() {
    return (
        <motion.div
            className='ContainerFull'
            initial={{ opacity: 0, x: 1000 }} // Inicia desde la derecha
            animate={{ opacity: 1, x: 0 }} // Animación hacia la izquierda
            exit={{ opacity: 0, x: -1000 }} // Sale hacia la izquierda
            transition={{ duration: 1 }}>
            <Logo3></Logo3>
            <FullscreenCard>
            <div>
            <ButtonLink destino="/AsignarA1" clase="ButtonRegresar">Asignar</ButtonLink>
            <ButtonLink destino="/CancelarA1" clase="ButtonRegresar">Cancelar</ButtonLink>
            </div>
            <br></br>
            <div className='CenterTable'>
                <table className='Table'>
                    <thead>
                        <tr>
                            <th style={{ width: '200px' }}>Nivel</th>
                            <th style={{ width: '200px' }}>Examen #</th>
                            <th style={{ width: '200px' }}>Descripcion</th>
                            <th style={{ width: '200px' }}>Nota</th>
                            <th style={{ width: '200px' }}>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>INGA1</td>
                            <td>1</td>
                            <td>Quiz Units 1&2</td>
                            <td>0.0</td>
                            <td>Pendiente</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <ButtonLink destino="/ProgramarA1" clase="ButtonRegresar">Regresar</ButtonLink>
            </FullscreenCard>
        </motion.div>
    )
}

export default ProgramarExamenA1