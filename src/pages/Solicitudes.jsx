import React, { useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import Logo3 from '../components/Logo3';
import { motion } from 'framer-motion';
import FullScreenCard from '../components/FullScreenCard';
import { fetchBody } from '../utils/fetch';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ButtonLink from '../components/ButtonLink';
import ContenedorForms from '../components/ContenedorForms';
import LabelInput from '../components/LabelInput';
import Select from '../components/Select';
import GeneralContext from '../context/GeneralContext';

function Solicitudes() {
    const navigate = useNavigate();

    useEffect(() => {
        const verificar = async () => {
            const respuesta = await fetchBody('/usuarios/', 'POST', { rol: "administrador" });
            if (respuesta.exito === false) {
                navigate("/")
            }
        };
        verificar();
    }, []);

    const [solicitudes, setSolicitudes] = useState([]);

    useEffect(() => {
        const obtenerSolicitudes = async () => {
            try {
                const respuesta = await fetchBody('/solicitudes/obtenerSolicitudes', 'GET');
                if (respuesta.exito) {
                    console.log(respuesta.lista);
                    const lista = respuesta.lista;
                    setSolicitudes(lista);
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
                    text: 'Error al procesar la solicitud para listar las solicitudes',
                    customClass: {
                        confirmButton: 'btn-color'
                    },
                    buttonsStyling: false
                });
            }
        }
        obtenerSolicitudes();
    }, []);

    const confirmarAccion = async (accion, estudiante, nivel, examen) => {
        // Si la solicitud ya está resuelta, mostrar alerta y salir
        if (examen.estado === 'aprobado' || examen.estado === 'rechazado') {
            Swal.fire({
                icon: 'info',
                title: 'Solicitud ya respondida',
                text: `Esta solicitud ya fue ${examen.estado}. No se puede modificar.`,
                customClass: {
                    confirmButton: 'btn-color'
                },
                buttonsStyling: false
            });
            return;
        }
    
        const resultado = await Swal.fire({
            title: `¿Estás seguro de ${accion === 'aprobar' ? 'aprobar' : 'rechazar'} esta solicitud?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'Cancelar',
            customClass: {
                confirmButton: 'btn-color',
                cancelButton: 'btn-color-cancel'
            },
            buttonsStyling: false
        });
    
        if (resultado.isConfirmed) {
            const nuevoEstado = accion === 'aprobar' ? 'aprobado' : 'rechazado';
    
            const token = localStorage.getItem('token');
            if (!token) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se encontró un token de autenticación. Inicia sesión nuevamente.',
                    customClass: { confirmButton: 'btn-color' },
                    buttonsStyling: false,
                });
                return;
            }
    
            const payload = JSON.parse(atob(token.split('.')[1]));
            const idAdmin = payload.id;
    
            const data = {
                idEstudiante: estudiante,
                nivel: nivel,
                examen: examen.idExamen,
                estado: nuevoEstado,
                idAdmin
            };
    
            console.log('Data enviada al backend:', data);
    
            const respuesta = await fetchBody('/solicitudes/actualizarEstado', 'POST', data);
    
            if (respuesta.exito) {
                Swal.fire({
                    icon: 'success',
                    title: 'Solicitud actualizada',
                    text: `Se ha ${nuevoEstado} la solicitud correctamente.`,
                    customClass: {
                        confirmButton: 'btn-color'
                    },
                    buttonsStyling: false
                });
    
                // Actualizar estado localmente
                setSolicitudes(prev => prev.map(est => {
                    if (est.idEstudiante !== estudiante.idEstudiante) return est;
                    return {
                        ...est,
                        niveles: est.niveles.map(niv => {
                            if (niv.idNivel !== nivel.idNivel) return niv;
                            return {
                                ...niv,
                                examenes: niv.examenes.map(ex => {
                                    if (ex.idExamen !== examen.idExamen) return ex;
                                    return { ...ex, estado: nuevoEstado };
                                })
                            };
                        })
                    };
                }));
    
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: respuesta.error || 'Error al actualizar la solicitud',
                    customClass: {
                        confirmButton: 'btn-color'
                    },
                    buttonsStyling: false
                });
            }
        }
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
                {/* Tabla de resultados */}
                <div className="CenterTable">
                    <table className="Table">
                        <thead>
                            <tr>
                                <th style={{ width: '250px' }}>Nombre Estudiante</th>
                                <th style={{ width: '250px' }}>Documento</th>
                                <th style={{ width: '250px' }}>Nivel</th>
                                <th style={{ width: '250px' }}>Examen</th>
                                <th style={{ width: '250px' }}>Estado</th>
                                <th style={{ width: '250px' }}>Fecha Solicitud</th>
                                <th style={{ width: '250px' }}>Intentos</th>
                                <th style={{ width: '250px' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {solicitudes.map((estudiante) =>
                                estudiante.niveles.map((nivel) =>
                                    nivel.examenes.map((examen, index) => (
                                        <tr key={`${estudiante.idEstudiante}-${nivel.idNivel}-${examen.idExamen}-${index}`}>
                                            <td>{`${estudiante.nombre} ${estudiante.apellido}`}</td>
                                            <td>{estudiante.documento}</td>
                                            <td>{nivel.idNivel}</td>
                                            <td>{examen.idExamen}</td>
                                            <td>{examen.estado}</td>
                                            <td>{examen.fechaSolicitud}</td>
                                            <td>{examen.intentos}</td>
                                            <td>
                                                <button
                                                    className="BtnSuccess"
                                                    onClick={() => confirmarAccion('aprobar', estudiante.idEstudiante, nivel.idNivel, examen)}
                                                >
                                                    ✅
                                                </button>
                                                <button
                                                    className="BtnDanger"
                                                    onClick={() => confirmarAccion('rechazar', estudiante.idEstudiante, nivel.idNivel, examen)}
                                                >
                                                    ❌
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )
                            )}
                        </tbody>
                    </table>
                </div>

                <ButtonLink destino="/Admin" clase="ButtonRegresar">Regresar</ButtonLink>

            </FullScreenCard>
        </motion.div>

    );
}

export default Solicitudes;