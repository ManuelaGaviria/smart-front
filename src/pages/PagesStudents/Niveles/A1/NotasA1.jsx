
import Logo3 from '../../../../components/Logo3';
import { motion } from 'framer-motion';
import FullscreenCard from '../../../../components/FullScreenCard';
import ButtonLink from '../../../../components/ButtonLink';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useContext } from 'react';
import { fetchBody } from "../../../../utils/fetch";
import Swal from 'sweetalert2';

function NotasA1() {
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
                const respuesta = await fetchBody('/estudiantes/listarNotasExamen', 'POST', { idEstudiante: idEstudiante, nivel: "A1" })
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

    async function handleSolicitud(examenId) {
        //Acá solo se manda una solicitud al administrador para que lo deje presentar el examen otra vez
        //Primero mira la nota promedio, si la nota promedio es 4 le dice que no puede solicitar intento
        //Si es menos de 4 le dice que se mando la solicitud y se guarda en la bd
        //Solicitudes/idEstudiante/nivel/examenId/ -> campos: intentos: 1
        //Si intentos es mayor a 3, le debe salir una alerta diciendo que debe ir presencial a solicitarla
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
                                        <td>INGA1</td>
                                        <td>{nota.examen}</td>
                                        <td>{nota.tematica} - {nota.examenId}</td>
                                        <td>{nota.notaExamenEscrito}</td>
                                        <td>{nota.notaExamenOral}</td>
                                        <td>{nota.promedio}</td>
                                        <td>{nota.comentario}</td>
                                        <td>
                                            <button className='btn-edit' onClick={() => handleSolicitud(nota.examenId)}>Solicitar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <ButtonLink destino="/A1" clase="ButtonRegresar">Regresar</ButtonLink>
            </FullscreenCard>
        </motion.div>
    )
}

export default NotasA1