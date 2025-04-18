
import Logo3 from '../../../../components/Logo3';
import { motion } from 'framer-motion';
import FullscreenCard from '../../../../components/FullScreenCard';
import ButtonLink from '../../../../components/ButtonLink';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { fetchBody } from "../../../../utils/fetch";
import Swal from 'sweetalert2';
import { FaEye } from "react-icons/fa";

function NotasB2() {
    const navigate = useNavigate();
    const [notas, setNotas] = useState([]);
    useEffect(() => {
        const verificar = async () => {
            const respuesta = await fetchBody('/usuarios/', 'POST', { rol: "estudiante" });
            if (respuesta.exito === false) {
                navigate("/")
            }
        }
        verificar();
    }, [])

    useEffect(() => {
        listNotas();
    }, []);

    async function listNotas() {
        const token = localStorage.getItem('token');
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const idEstudiante = payload.id;
            try {

                const respuesta = await fetchBody('/estudiantes/listarNotasExamen', 'POST', { idEstudiante: idEstudiante, nivel: "B2" })
                if (respuesta.exito) {
                    console.log('respuesta.lista.notasExamenes :>> ', respuesta.lista.notasExamenes);

                    // Agregar el cálculo del promedio a cada examen
                    const notasConPromedio = respuesta.lista.notasExamenes.map(examen => {
                        const notaEscrito = parseFloat(examen.notaExamenEscrito) || 0;
                        const notaOral = parseFloat(examen.notaExamenOral) || 0;
                        const promedio = ((notaEscrito + notaOral) / 2).toFixed(2); // Redondeamos a 2 decimales

                        return {
                            ...examen,
                            promedio: promedio
                        };
                    });

                    console.log('Notas con promedio: ', notasConPromedio);
                    setNotas(notasConPromedio);
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
                    text: 'Error al procesar la solicitud para listar las notas',
                    customClass: {
                        confirmButton: 'btn-color'
                    },
                    buttonsStyling: false
                });
            }
        }

    }

    async function handleSolicitud(examenId, nivel, promedio, notaEscrito, notaOral) {
        const token = localStorage.getItem('token');
        if (!token) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Usuario no autenticado",
                customClass: { confirmButton: 'btn-color' },
                buttonsStyling: false
            });
            return;
        }

        // 🚫 Validar que ambas notas estén presentes
        if (
            notaEscrito === null || notaOral === null ||
            notaEscrito === undefined || notaOral === undefined ||
            notaEscrito === "" || notaOral === ""
        ) {
            Swal.fire({
                icon: "info",
                title: "Examen incompleto",
                text: "Aún no has recibido calificación completa de este examen. Por favor espera a que se califique el examen escrito y oral.",
                customClass: { confirmButton: 'btn-color' },
                buttonsStyling: false
            });
            return;
        }

        const payload = JSON.parse(atob(token.split('.')[1]));
        const idEstudiante = payload.id;

        // Si la nota es mayor o igual a 4, no puede solicitar otro intento
        if (parseFloat(promedio) >= 4.0) {
            Swal.fire({
                icon: "info",
                title: "No puedes solicitar otro intento",
                text: "Tu nota es igual o mayor a 4.0, por lo que no puedes repetir este examen.",
                customClass: { confirmButton: 'btn-color' },
                buttonsStyling: false
            });
            return;
        }

        try {
            const respuesta = await fetchBody('/estudiantes/obtenerIntento', 'POST', { idEstudiante, nivel, examenId });

            if (respuesta.exito) {
                const intentosPrevios = respuesta.intentos;
                console.log('intentosPrevios :>> ', intentosPrevios);
                const estadoSolicitud = respuesta.estado || null;

                if (estadoSolicitud === "pendiente") {
                    Swal.fire({
                        icon: "info",
                        title: "Solicitud en revisión",
                        text: "Ya has solicitado un intento adicional. Debes esperar la aprobación del administrador.",
                        customClass: { confirmButton: 'btn-color' },
                        buttonsStyling: false
                    });
                    return;
                }

                if (intentosPrevios >= 2) {
                    Swal.fire({
                        icon: "warning",
                        title: "Límite de intentos alcanzado",
                        text: "Has alcanzado el máximo de intentos permitidos. Debes solicitar otro intento presencialmente.",
                        customClass: { confirmButton: 'btn-color' },
                        buttonsStyling: false
                    });
                    return;
                }

                const data = {
                    idEstudiante,
                    nivel,
                    examenId,
                    intentos: intentosPrevios + 1,
                    estado: "pendiente",
                    fechaSolicitud: new Date().toISOString()
                };

                const respuestaGuardar = await fetchBody('/estudiantes/solicitarIntento', 'POST', data);

                if (respuestaGuardar.exito) {
                    Swal.fire({
                        icon: "success",
                        title: "Solicitud enviada",
                        text: "Tu solicitud ha sido enviada al administrador para su revisión.",
                        customClass: { confirmButton: 'btn-color' },
                        buttonsStyling: false
                    });
                } else {
                    throw new Error(respuestaGuardar.error || "Error al enviar la solicitud.");
                }
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message,
                customClass: { confirmButton: 'btn-color' },
                buttonsStyling: false
            });
        }
    }

    async function handleVerSolicitud(examenId, nivel) {
        const token = localStorage.getItem('token');
        if (!token) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Usuario no autenticado",
                customClass: { confirmButton: 'btn-color' },
                buttonsStyling: false
            });
            return;
        }

        const payload = JSON.parse(atob(token.split('.')[1]));
        const idEstudiante = payload.id;

        const data = {
            idEstudiante: idEstudiante,
            nivel: nivel,
            examenId: examenId
        };

        const respuesta = await fetchBody('/estudiantes/verSolicitud', 'POST', data);

        if (respuesta.exito) {
            switch (respuesta.estado) {
                case 'pendiente':
                    Swal.fire({
                        icon: "warning",
                        title: "Solicitud pendiente",
                        text: "Tu solicitud ha sido enviada al administrador para su revisión.",
                        customClass: { confirmButton: 'btn-color' },
                        buttonsStyling: false
                    });
                  break;
                case 'rechazado':
                    Swal.fire({
                        icon: "error",
                        title: "Solicitud rechazada",
                        text: "Tu solicitud ha sido rechazada, solicita un nuevo intento.",
                        customClass: { confirmButton: 'btn-color' },
                        buttonsStyling: false
                    });
                  break;
                case 'aprobado':
                    Swal.fire({
                        icon: "success",
                        title: "Solicitud aprobada",
                        text: "Tu solicitud ha sido aprobada, puedes presentar el examen " + examenId + " nuevamente",
                        customClass: { confirmButton: 'btn-color' },
                        buttonsStyling: false
                    });
                  break;
                  case 'gano':
                    Swal.fire({
                        icon: "success",
                        title: "Solicitud aprobada",
                        text: "Ya realizaste el intento y lo ganaste!",
                        customClass: { confirmButton: 'btn-color' },
                        buttonsStyling: false
                    });
                  break;
                  case 'perdio':
                    Swal.fire({
                        icon: "error",
                        title: "Solicitud aprobada",
                        text: "Ya realizaste el intento y lo perdiste. Solicita un nuevo intento",
                        customClass: { confirmButton: 'btn-color' },
                        buttonsStyling: false
                    });
                  break;
                  case 'pendiente nota':
                    Swal.fire({
                        icon: "success",
                        title: "Solicitud aprobada",
                        text: "Tu solicitud fue aprobada, estás realizando otro intento",
                        customClass: { confirmButton: 'btn-color' },
                        buttonsStyling: false
                    });
                  break;
                  case 'sin solicitud':
                    Swal.fire({
                        icon: "error",
                        title: "Sin solicitud",
                        text: "No tienes solicitudes relacionadas al examen " + examenId,
                        customClass: { confirmButton: 'btn-color' },
                        buttonsStyling: false
                    });
                  break;
                default:
                    Swal.fire({
                        icon: "error",
                        title: "Solicitud Inválida",
                        text: "No tienes solicitudes relacionadas al examen " + examenId,
                        customClass: { confirmButton: 'btn-color' },
                        buttonsStyling: false
                    });
            }
            
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No tienes una solicitud en proceso",
                customClass: { confirmButton: 'btn-color' },
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
                </div>
                <br></br>
                <div className='CenterTable'>
                    {notas.length === 0 ? (
                        <p>Aún no hay notas por mostrar</p>
                    ) : (
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
                                    <th style={{ width: '200px' }}>Intento</th>
                                </tr>
                            </thead>
                            <tbody>
                                {notas.map((nota) => (
                                    <tr key={nota.examenId}>
                                        <td>INGB2</td>
                                        <td>{nota.examen}</td>
                                        <td>{nota.tematica} - {nota.examenId}</td>
                                        <td>{nota.notaExamenEscrito}</td>
                                        <td>{nota.notaExamenOral}</td>
                                        <td>{nota.promedio}</td>
                                        <td>{nota.comentario}</td>
                                        <td>
                                            <button
                                                className='btn-color'
                                                onClick={() =>
                                                    handleSolicitud(nota.examenId, "B2", nota.promedio, nota.notaExamenEscrito, nota.notaExamenOral)
                                                }
                                            >
                                                Solicitar
                                            </button>
                                            <button
                                                className='btn-eye'
                                                onClick={() =>
                                                    handleVerSolicitud(nota.examenId, "B2")
                                                }
                                            >
                                                <FaEye />
                                            </button>

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <ButtonLink destino="/B2" clase="ButtonRegresar">Regresar</ButtonLink>
            </FullscreenCard>
        </motion.div>
    )
}

export default NotasB2