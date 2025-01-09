
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
                    setNotas(respuesta.lista.notasExamenes)
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
                                </tr>
                            </thead>
                            <tbody>
                                {notas.map((nota) => (
                                    <tr key={nota.examenId}>
                                        <td>INGA1</td>
                                        <td>{nota.examen}</td>
                                        <td>{nota.tematica} - {nota.examenId}</td>
                                        <td>{nota.nota}</td>
                                        <td>0.00</td>
                                        <td>x</td>
                                        <td>x</td>
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