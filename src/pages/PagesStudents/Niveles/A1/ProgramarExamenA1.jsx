
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

function ProgramarExamenA1() {
    const navigate = useNavigate();

    useEffect(() => {
        const verificar = async () => {
            const respuesta = await fetchBody('/usuarios/', 'POST', { rol: "estudiante" });
            if (respuesta.exito === false) {
                navigate("/")
            } else {
                listExamenes();
            }
        }
        verificar();
    }, [navigate]);

    const [asignModalOpen, setAsignModalOpen] = useState(false);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [examenes, setExamen] = useState([]);
    const [examenesProgramados, setExamenProgramado] = useState([]);
    const [horas, setHoras] = useState([]);
    const [examenesSelect, setExamenSelect] = useState([]);
    const [examenSeleccionado, setExamenSeleccionado] = useState("");
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
        const obtenerExamenes = async () => {
            try {
                const respuesta = await fetchBody('/niveles/obtenerExamen', 'POST', { nivel: "A1" });
                if (respuesta.exito) {
                    const examenesFormateados = respuesta.lista.map(examen => ({
                        nombre: examen.id,
                        id: examen.id
                    }));
                    setExamenSelect(examenesFormateados);
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
                    text: 'Error al procesar la solicitud para listar los examenes',
                    customClass: {
                        confirmButton: 'btn-color'
                    },
                    buttonsStyling: false
                });
            }
        }
        obtenerExamenes();
    }, []);

    async function listExamenes() {
        try {
            const token = localStorage.getItem("token");

            if (token) {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const idEst = payload.id;

                // Obtener la lista de examenes disponibles
                const respuestaExamenes = await fetchBody('/niveles/listarExamen', 'POST', { nivel: 'A1' });

                // Obtener el estado de los examenes programados
                const respuestaEstado = await fetchBody('/estudiantes/actualizarEstadoExamen', 'POST', { idEstudiante: idEst, nivel: 'A1' });

                if (respuestaExamenes.exito && respuestaEstado.exito) {
                    const examenesDisponibles = respuestaExamenes.lista;
                    const examenesProgramados = respuestaEstado.estadoExamenes;

                    // Combinar ambas listas
                    const examenesCombinados = examenesDisponibles.map(examen => {
                        const examenProgramado = examenesProgramados.find(c => c.id === examen.id);
                        return {
                            ...examen,
                            estado: examenProgramado ? examenProgramado.data.estado : 'pendiente',
                            nota: examenProgramado ? examenProgramado.data.nota : '0.0'
                        };
                    });

                    setExamen(examenesCombinados);
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: respuestaExamenes.error || respuestaEstado.error,
                        customClass: {
                            confirmButton: 'btn-color'
                        },
                        buttonsStyling: false
                    });
                }

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
                    <button onClick={openAsignModal} className="ButtonRegresar">Asignar</button>
                    <button onClick={openCancelModal} className="ButtonRegresar">Cancelar</button>
                    <ButtonLink destino="/HorarioExamenA1" clase="ButtonRegresar">Ver Horario</ButtonLink>
                </div>
                <br></br>
                <div className='CenterTable'>
                    <table className='Table'>
                        <thead>
                            <tr>
                                <th style={{ width: '200px' }}>Nivel</th>
                                <th style={{ width: '200px' }}>Examen #</th>
                                <th style={{ width: '200px' }}>Unidades</th>
                                <th style={{ width: '200px' }}>Descripcion</th>
                                <th style={{ width: '200px' }}>Clase que lo desbloquea</th>
                                <th style={{ width: '200px' }}>Nota</th>
                                <th style={{ width: '200px' }}>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {examenes.map((examen) => (
                                <tr key={examen.id}>
                                    <td>INGA1</td>
                                    <td>{examen.examen}</td>
                                    <td>{examen.unidades}</td>
                                    <td>{examen.tematica}</td>
                                    <td>{examen.clase}</td>
                                    <td>{examen.nota}</td>
                                    <td>{examen.estado}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <ButtonLink destino="/ProgramarA1" clase="ButtonRegresar">Regresar</ButtonLink>
            </FullscreenCard>

            
        </motion.div>
    )
}

export default ProgramarExamenA1