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
import Select from '../../../../components/Select';

function ProgramarClaseA1() {
    const navigate = useNavigate();

    useEffect(() => {
        const verificar = async () => {
            const respuesta = await fetchBody('/usuarios/', 'POST', { rol: "estudiante" });
            if (respuesta.exito === false) {
                navigate("/")
            } else {
                listClases();
                listClasesDisponibles();
                listHoras(new Date());
            }
        }
        verificar();
    }, [navigate]);

    const [asignModalOpen, setAsignModalOpen] = useState(false);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [clases, setClase] = useState([]);
    const [horas, setHoras] = useState([]);
    const [clasesSelect, setClaseSelect] = useState([]);
    const [claseSeleccionada, setClaseSeleccionada] = useState("");
    const [backgroundOpacity] = useState(0.5);
    const [selectedCheckbox, setSelectedCheckbox] = useState(null);
    const [selectedTime, setSelectedTime] = useState({ horaInicial: "", horaFinal: "" });

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

    useEffect(() => {
        const obtenerClases = async () => {
            try {
                const respuesta = await fetchBody('/niveles/obtenerClase', 'POST', { nivel: "A1" });
                if (respuesta.exito) {
                    const clasesFormateadas = respuesta.lista.map(clase => ({
                        nombre: clase.id,
                        id: clase.id
                    }));
                    setClaseSelect(clasesFormateadas);
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
        obtenerClases();
    }, []);

    async function listClases() {
        try {
            const respuesta = await fetchBody('/niveles/listarClase', 'POST', { nivel: "A1" })
            if (respuesta.exito) {
                setClase(respuesta.lista)
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

    async function listClasesDisponibles() {
        try {
            const respuestaClasesDisponibles = await fetchBody('/niveles/listarClase', 'POST', { nivel: "A1" });
            if (respuestaClasesDisponibles.exito) {
                const token = localStorage.getItem("token");

                if (token) {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    const idEst = payload.id;

                    const respuestaClasesProgramadas = await fetchBody('/estudiantes/actualizarClasesDisponibles', 'POST', { id: idEst });

                    if (respuestaClasesProgramadas.exito) {
                        const clasesProgramadas = respuestaClasesProgramadas.clasesProgramadas;

                        const clasesDisponibles = respuestaClasesDisponibles.lista.filter(clase => !clasesProgramadas.includes(clase.id));
                        const clasesFormateadas = clasesDisponibles.map(clase => ({
                            nombre: clase.id,
                            id: clase.id
                        }));

                        setClaseSelect(clasesFormateadas);
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: respuestaClasesProgramadas.error,
                            customClass: {
                                confirmButton: 'btn-color'
                            },
                            buttonsStyling: false
                        });
                    }
                }
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: respuestaClasesDisponibles.error,
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
                text: 'Error al procesar la solicitud para listar las clases disponibles',
                customClass: {
                    confirmButton: 'btn-color'
                },
                buttonsStyling: false
            });
        }
    }

    async function listHoras(date) {
        try {
            const respuesta = await fetchGet('/estudiantes/obtenerHora');
            if (respuesta.exito) {
                let { horasIniciales, horasFinales } = respuesta;

                // Emparejar las horas iniciales y finales
                let horas = horasIniciales.map((horaInicial, index) => ({
                    horaInicial,
                    horaFinal: horasFinales[index]
                }));

                // Filtrar horas si la fecha seleccionada es hoy
                if (isToday(date)) {
                    const now = new Date();
                    horas = horas.filter(hora => new Date(`${date.toDateString()} ${hora.horaInicial}`) > now);
                }

                setHoras(horas);
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

    const handleChange = (e) => {
        setClaseSeleccionada(e.target.value); // Actualizar el estado con la clase seleccionada
        console.log('Clase seleccionada:', e.target.value);
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses de 0 a 11
        const day = String(date.getDate()).padStart(2, '0'); // Días del mes

        return `${year}-${month}-${day}`;
    };

    async function programarClase() {
        if (claseSeleccionada === "") {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Por favor selecciona una clase para programar.",
                customClass: {
                    confirmButton: 'btn-color'
                },
                buttonsStyling: false
            });
        } else if (selectedCheckbox === null) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Por favor selecciona una hora para programar.",
                customClass: {
                    confirmButton: 'btn-color'
                },
                buttonsStyling: false
            });
        } else {

            const token = localStorage.getItem("token");

            if (token) {
                // Decodificar el payload del token (segundo segmento)
                const payload = JSON.parse(atob(token.split('.')[1]));

                // Acceder al id y rol del usuario
                const idUsuario = payload.id;

                console.log(`ID del usuario: ${idUsuario}`);

                // Suponiendo que `data` es el objeto que contiene la fecha y otros datos
                const data = {
                    clase: claseSeleccionada,
                    fecha: selectedDate, // Aquí deberías tener la fecha original
                    horaInicial: selectedTime.horaInicial,
                    horaFinal: selectedTime.horaFinal
                };

                const formattedDate = formatDate(data.fecha);

                const requestData = {
                    nivel: 'A1',
                    clase: data.clase,
                    fecha: formattedDate, // Usar la fecha formateada
                    horaInicial: data.horaInicial,
                    horaFinal: data.horaFinal,
                    idEstudiante: idUsuario
                };

                const respuesta = await fetchBody('/estudiantes/programarClase', 'POST', requestData);

                if (respuesta.exito) {
                    Swal.fire({
                        icon: "success",
                        title: "Clase programada con exito!",
                        customClass: {
                            confirmButton: 'btn-color'
                        },
                        buttonsStyling: false
                    });
                    handleCloseModal();
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: 'Error al programar una clase',
                        customClass: {
                            confirmButton: 'btn-color'
                        },
                        buttonsStyling: false
                    });
                }

            }

        }
    }

    const handleCheckboxChange = (index, horaInicial, horaFinal, checked) => {
        console.log(index);
        console.log(horaInicial);
        console.log(horaFinal);
        if (checked) {
            setSelectedCheckbox(index);
            setSelectedTime({ horaInicial, horaFinal });
            console.log(selectedTime);
        } else {
            // Aquí, al desmarcar, se limpia la selección solo si el índice coincide
            if (selectedCheckbox === index) {
                setSelectedCheckbox(null);
                setSelectedTime({ horaInicial: "", horaFinal: "" });
            }
        }
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
                            <b><Select titulo="Clase" opciones={clasesSelect}
                                eventoCambio={handleChange}></Select></b>
                            <br />

                            <div>
                                <div className='CenterTable'>
                                    <table className='Table'>
                                        <thead>
                                            <tr>
                                                <th style={{ width: '200px' }}>Hora Inicial</th>
                                                <th style={{ width: '200px' }}>Hora Final</th>
                                                <th style={{ width: '200px' }}>Cupos</th>
                                                <th style={{ width: '200px' }}>Seleccionar</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {horas.map((hora, index) => (
                                                <tr key={index}>
                                                    <td>{hora.horaInicial}</td>
                                                    <td>{hora.horaFinal}</td>
                                                    <td>3/6</td>
                                                    <td>
                                                        <Checkbox
                                                            id={index}
                                                            label=""
                                                            checked={selectedCheckbox === index}
                                                            onChange={(checked) => handleCheckboxChange(index, hora.horaInicial, hora.horaFinal, checked)}
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <button onClick={handleCloseModal} className="ButtonRegresar">Regresar</button>
                            <button onClick={programarClase} className="ButtonRegresar">Agendar</button>

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
