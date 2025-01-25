import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Logo3 from '../../components/Logo3';
import { motion } from 'framer-motion';
import FullScreenCard from '../../components/FullScreenCard';
import { fetchBody } from '../../utils/fetch';
import { useNavigate } from 'react-router-dom';
import ButtonLink from '../../components/ButtonLink';
import ContenedorForms from '../../components/ContenedorForms';

function ProgramacionTeacher() {
    const navigate = useNavigate();

    const [programaciones, setProgramacion] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [backgroundOpacity] = useState(0.5);
    const [estudiantesSeleccionados, setEstudiantesSeleccionados] = useState([]);
    const [asistencias, setAsistencias] = useState({});
    const [loadingEstudiantes, setLoadingEstudiantes] = useState(false);

    // Verificar usuario al cargar el componente
    useEffect(() => {
        const verificar = async () => {
            console.log("Verificación ejecutada");
            const respuesta = await fetchBody('/usuarios/', 'POST', { rol: "profesor" });
            if (!respuesta.exito) {
                navigate("/");
            }
        };
        verificar();
    }, []);

    // Cargar programaciones
    useEffect(() => {
        console.log("listProgramacion ejecutado");
        listProgramacion();
    }, []);

    async function listProgramacion() {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const idProfesor = payload.id;

                const today = new Date();
                const formattedDate = today.toISOString().split('T')[0];
                const respuesta = await fetchBody('/profesores/listarProgramacion', 'POST', { fecha: formattedDate, idProfesor });
                if (respuesta.exito) {
                    setProgramacion(respuesta.lista);
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
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: 'Error al procesar la solicitud para listar la programación',
                customClass: {
                    confirmButton: 'btn-color'
                },
                buttonsStyling: false
            });
        }
    }

    // Abrir modal, obtener estudiantes y mostrar nombres
    const handleVerEstudiantes = async (estudiantesIds) => {
        try {
            setLoadingEstudiantes(true);
            const respuesta = await fetchBody('/profesores/listarNombres', 'POST', { ids: estudiantesIds });
            if (respuesta.exito) {
                setEstudiantesSeleccionados(respuesta.nombres); // Actualizar con nombres
                // Inicializar estado de asistencia
                const asistenciasIniciales = respuesta.nombres.reduce((acc, nombre) => {
                    acc[nombre] = false; // Todos comienzan sin asistencia marcada
                    return acc;
                }, {});
                setAsistencias(asistenciasIniciales);
                setModalOpen(true); // Abrir modal
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
                text: 'Error al obtener los nombres de los estudiantes',
                customClass: {
                    confirmButton: 'btn-color'
                },
                buttonsStyling: false
            });
        } finally {
            setLoadingEstudiantes(false);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEstudiantesSeleccionados([]);
        setAsistencias({});
    };

    const toggleAsistencia = (nombre) => {
        setAsistencias((prevAsistencias) => ({
            ...prevAsistencias,
            [nombre]: !prevAsistencias[nombre],
        }));
    };

    return (
        <motion.div
            className='ContainerFull'
            initial={{ opacity: 0, x: 1000 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -1000 }}
            transition={{ duration: 1 }}
        >
            <Logo3 />
            <FullScreenCard>
                <div className='CenterTable'>
                    <table className='Table'>
                        <thead>
                            <tr>
                                <th style={{ width: '250px' }}>Fecha (yyyy-mm-dd)</th>
                                <th style={{ width: '250px' }}>Hora Inicial</th>
                                <th style={{ width: '250px' }}>Estudiantes</th>
                                <th style={{ width: '250px' }}>Tipo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {programaciones.map((programacion) => (
                                <tr key={programacion.id}>
                                    <td>{programacion.fecha}</td>
                                    <td>{programacion.hora}</td>
                                    <td>
                                        <button
                                            className="btn-ver"
                                            onClick={() => handleVerEstudiantes(programacion.estudiantes)}
                                            disabled={loadingEstudiantes} // Bloquear si está cargando
                                        >
                                            {loadingEstudiantes ? 'Cargando...' : 'Ver'}
                                        </button>
                                    </td>
                                    <td>{programacion.tipo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <ButtonLink destino="/Teacher" clase="ButtonRegresar">Regresar</ButtonLink>
            </FullScreenCard>

            {/* Modal */}
            {modalOpen && (
                <>
                    <div
                        className="BackgroundOverlay"
                        style={{ opacity: backgroundOpacity }}
                    />
                    <ContenedorForms>
                        <h1>Lista de Estudiantes</h1>
                        <div className="CenterTable">
                            <table className="Table">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Asistencia</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {estudiantesSeleccionados.map((nombreEstudiante, index) => (
                                        <tr key={index}>
                                            <td>{nombreEstudiante}</td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={asistencias[nombreEstudiante]}
                                                    onChange={() => toggleAsistencia(nombreEstudiante)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <br />
                        <ButtonLink destino="#" clase="Button" eventoClick={handleCloseModal}>
                            Cerrar
                        </ButtonLink>
                        <ButtonLink destino="#" clase="Button" eventoClick={() => console.log(asistencias)}>
                            Guardar
                        </ButtonLink>
                    </ContenedorForms>
                </>
            )}
        </motion.div>
    );
}

export default ProgramacionTeacher;
