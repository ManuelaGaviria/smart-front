import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Logo3 from '../../../../components/Logo3';
import { motion } from 'framer-motion';
import FullscreenCard from '../../../../components/FullScreenCard';
import ButtonLink from '../../../../components/ButtonLink';
import { fetchBody, fetchGet } from '../../../../utils/fetch';
import ContenedorForms from '../../../../components/ContenedorForms';
import DateSelect from '../../../../components/DateSelect';
import Checkbox from '../../../../components/Checkbox';
import Swal from 'sweetalert2';

function ProgramarClaseA1() {
    const navigate = useNavigate();

    useEffect(() => {
        const verificar = async () => {
            const respuesta = await fetchBody('/usuarios/', 'POST', { rol: "estudiante" });
            if (respuesta.exito === false) {
                navigate("/")
            } else {
                listClases();
                listHoras(new Date());
            }
        }
        verificar();
    }, [navigate]);

    const [asignModalOpen, setAsignModalOpen] = useState(false);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [clases, setClase] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [horasIniciales, setHorasIniciales] = useState([]);
    const [horasFinales, setHorasFinales] = useState([]);
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

    async function listClases() {
        try {
            const respuesta = await fetchBody('/niveles/listarClase', 'POST', { nivel: "A1" })
            if (respuesta.exito) {
                setClase(respuesta.lista)
                console.log(respuesta.lista);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: respuesta.error,
                    customClass: {
                        confirmButton: 'btn-color'
                    },
                    buttonsStyling: false
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: 'Error al procesar la solicitud para listar las clases',
                customClass: {
                    confirmButton: 'btn-color'
                },
                buttonsStyling: false
            });
        }
    }

    async function listHoras(date) {
        try {
            const respuesta = await fetchBody('/estudiantes/obtenerHora');
            if (respuesta.exito) {
                let { horasIniciales, horasFinales } = respuesta;

                // Filtrar horas si la fecha seleccionada es hoy
                if (isToday(date)) {
                    const now = new Date();
                    horasIniciales = horasIniciales.filter(hora => new Date(`${date.toDateString()} ${hora}`) > now);
                    horasFinales = horasFinales.filter(hora => new Date(`${date.toDateString()} ${hora}`) > now);
                }

                setHorasIniciales(horasIniciales);
                setHorasFinales(horasFinales);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: respuesta.error,
                    customClass: {
                        confirmButton: 'btn-color'
                    },
                    buttonsStyling: false
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: 'Error al procesar la solicitud para listar las horas',
                customClass: {
                    confirmButton: 'btn-color'
                },
                buttonsStyling: false
            });
        }
    }

    const isToday = (date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        listHoras(date);
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
                                <th style={{ width: '200px' }}>Código</th>
                                <th style={{ width: '200px' }}>Clase #</th>
                                <th style={{ width: '200px' }}>Descripción</th>
                                <th style={{ width: '200px' }}>Asistencia</th>
                                <th style={{ width: '200px' }}>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clases.map((clase) => (
                                <tr key={clase.id}>
                                    <td>{clase.codigo}</td>
                                    <td>Clase {clase.numero}</td>
                                    <td>{clase.descripcion}</td>
                                    <td>❌</td>
                                    <td>Pendiente</td>
                                </tr>
                            ))}
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
                            <DateSelect onDateChange={handleDateChange}></DateSelect>
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
                                            {clases.map((clase, index) => (
                                                <tr key={clase.id}>
                                                    <td>Clase {clase.numero}</td>
                                                    <td>{horasIniciales[index]}</td>
                                                    <td>{horasFinales[index]}</td>
                                                    <td>3/6</td> {/* Ejemplo de cupos */}
                                                    <td>
                                                        <Checkbox id={clase.id}></Checkbox>
                                                    </td>
                                                </tr>
                                            ))}
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
                            <DateSelect onDateChange={handleDateChange}></DateSelect>
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
