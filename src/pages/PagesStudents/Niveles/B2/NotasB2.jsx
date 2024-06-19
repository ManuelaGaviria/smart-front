
import Logo3 from '../../../../components/Logo3';
import { motion } from 'framer-motion';
import FullscreenCard from '../../../../components/FullScreenCard';
import ButtonLink from '../../../../components/ButtonLink';

function NotasB2() {
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
            </div>
            <br></br>
            <div className='CenterTable'>
                <table className='Table'>
                    <thead>
                        <tr>
                            <th style={{ width: '200px' }}>Nivel</th>
                            <th style={{ width: '200px' }}>Examen #</th>
                            <th style={{ width: '200px' }}>Descripcion</th>
                            <th style={{ width: '200px' }}>Nota examen escrito</th>
                            <th style={{ width: '200px' }}>Nota examen oral</th>
                            <th style={{ width: '200px' }}>Nota final</th>
                            <th style={{ width: '200px' }}>Retroalimentación</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>INGB2</td>
                            <td>1</td>
                            <td>Quiz Units 1&2</td>
                            <td>4.0</td>
                            <td>4.5</td>
                            <td>4.3</td>
                            <td>Estudiar el tema X</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <ButtonLink destino="/B2" clase="ButtonRegresar">Regresar</ButtonLink>
            </FullscreenCard>
        </motion.div>
    )
}

export default NotasB2