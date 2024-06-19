import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Logo3 from '../../../../components/Logo3';
import { motion } from 'framer-motion';
import FullscreenCard from '../../../../components/FullScreenCard';
import ButtonLink from '../../../../components/ButtonLink';
import { fetchBody } from '../../../../utils/fetch';
import ContenedorForms from '../../../../components/ContenedorForms';
import DateSelect from '../../../../components/DateSelect';
import Checkbox from '../../../../components/Checkbox';

function ProgramarClaseA1() {
    const navigate = useNavigate();

    useEffect(() => {
        const verificar = async () => {
            const respuesta = await fetchBody('/usuarios/', 'POST', {rol: "estudiante"});
            if (respuesta.exito === false) {
                navigate("/")
            }
        }
        verificar();
    }, [navigate]);

    const [asignModalOpen, setAsignModalOpen] = useState(false);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [backgroundOpacity] = useState(0.5);

    const openAsignModal = () => {
        setAsignModalOpen(true);
    };

    const handleCloseModal = () => {
        setAsignModalOpen(false);
    };

    const openCancelModal = () => {
        setCancelModalOpen(true);
    };

    const handleCloseCancelModal = () => {
        setCancelModalOpen(false);
    };

    return (
        <motion.div
            className='ContainerFull'
            initial={{ opacity: 0, x: 1000 }} // Inicia desde la derecha
            animate={{ opacity: 1, x: 0 }} // Animación hacia la izquierda
            exit={{ opacity: 0, x: -1000 }} // Sale hacia la izquierda
            transition={{ duration: 1 }}>
            <Logo3 />
            <FullscreenCard>
                <div>
                    <button onClick={openAsignModal} className="ButtonRegresar">Asignar</button>
                    <button onClick={openCancelModal} className="ButtonRegresar">Cancelar</button>
                    <ButtonLink destino="/HorarioA1" clase="ButtonRegresar">Ver Horario</ButtonLink>
                </div>
                <br />
                <div className='CenterTable'>
                    <table className='Table'>
                        <thead>
                            <tr>
                                <th style={{ width: '200px' }}>Nivel</th>
                                <th style={{ width: '200px' }}>Clase #</th>
                                <th style={{ width: '200px' }}>Descripcion</th>
                                <th style={{ width: '200px' }}>Asistencia</th>
                                <th style={{ width: '200px' }}>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>INGA1</td>
                                <td>1</td>
                                <td>Clase 1</td>
                                <td>false</td>
                                <td>Pendiente</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <ButtonLink destino="/ProgramarA1" clase="ButtonRegresar">Regresar</ButtonLink>
            </FullscreenCard>

            {asignModalOpen && (
                <>
                    <div
                    className="BackgroundOverlay"
                    style={{ opacity: backgroundOpacity }}
                    />
                    <ContenedorForms>
                        <h1>Programar clase</h1>
                        <div className="InputContainer">
                            <label className='labelFecha'>Fecha</label>
                            <DateSelect></DateSelect>
                            <br />
                            <br />
                            <div>
                                <div className='CenterTable'>
                                    <table className='Table'>
                                        <thead>
                                            <tr>
                                                <th style={{ width: '200px' }}>Clase #</th>
                                                <th style={{ width: '200px' }}>Hora Inicial</th>
                                                <th style={{ width: '200px' }}>Hora Final</th>
                                                <th style={{ width: '200px' }}>Cupos</th>
                                                <th style={{ width: '200px' }}>Seleccionar</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1</td>
                                                <td>10:30</td>
                                                <td>12:00</td>
                                                <td>3/6</td>
                                                <td>
                                                    <Checkbox id="checkbox1"></Checkbox>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>2</td>
                                                <td>13:30</td>
                                                <td>15:00</td>
                                                <td>1/6</td>
                                                <td>
                                                    <Checkbox id="checkbox2"></Checkbox>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <button onClick={handleCloseModal} className="ButtonRegresar">Regresar</button>
                            <ButtonLink destino="/ProgramarClaseA1" clase="ButtonRegresar">Terminar</ButtonLink>
                            <br />
                            <br />
                        </div>
                    </ContenedorForms>
                </>
            )}

            {cancelModalOpen && (
                <>
                    <div
                    className="BackgroundOverlay"
                    style={{ opacity: backgroundOpacity }}
                    />
                    <ContenedorForms>
                        <h1>Cancelar clase</h1>
                        <div className="InputContainer">
                            <label className='labelFecha'>Fecha</label>
                            <DateSelect></DateSelect>
                            <br />
                            <br />
                            <div>
                                <div className='CenterTable'>
                                    <table className='Table'>
                                        <thead>
                                            <tr>
                                                <th style={{ width: '200px' }}>Clase #</th>
                                                <th style={{ width: '200px' }}>Hora Inicial</th>
                                                <th style={{ width: '200px' }}>Hora Final</th>
                                                <th style={{ width: '200px' }}>Cupos</th>
                                                <th style={{ width: '200px' }}>Seleccionar</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1</td>
                                                <td>10:30</td>
                                                <td>12:00</td>
                                                <td>3/6</td>
                                                <td>
                                                    <Checkbox id="checkbox1"></Checkbox>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>2</td>
                                                <td>13:30</td>
                                                <td>15:00</td>
                                                <td>1/6</td>
                                                <td>
                                                    <Checkbox id="checkbox2"></Checkbox>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <button onClick={handleCloseCancelModal} className="ButtonRegresar">Regresar</button>
                            <ButtonLink destino="/ProgramarClaseA1" clase="ButtonRegresar">Terminar</ButtonLink>
                            <br />
                            <br />
                        </div>
                    </ContenedorForms>
                </>
            )}
        </motion.div>
    );
}

export default ProgramarClaseA1;
