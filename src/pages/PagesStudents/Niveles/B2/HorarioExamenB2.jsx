
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Logo3 from '../../../../components/Logo3';
import { motion } from 'framer-motion';
import FullscreenCard from '../../../../components/FullScreenCard';
import ButtonLink from '../../../../components/ButtonLink';
import { fetchBody } from '../../../../utils/fetch';
import Swal from 'sweetalert2';

function HorarioExamenB2() {

    const navigate = useNavigate();

    useEffect(() => {
        const verificar = async () => {
            const respuesta = await fetchBody('/usuarios/', 'POST', { rol: "estudiante" });
            if (respuesta.exito === false) {
                navigate("/")
            } else {
                listExamenesProgramados();
            }
        }
        verificar();
    }, [navigate]);

     const [examenesProgramados, setExamenProgramado] = useState([]);

    async function listExamenesProgramados() {
            try {
                const token = localStorage.getItem("token");
    
                if (token) {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    const idEst = payload.id;
    
                    // Obtener la lista de clases disponibles
                    const respuesta = await fetchBody('/estudiantes/listarExamenProgramado', 'POST', { idEstudiante: idEst, nivel: 'B2' });
                    console.log('respuesta.lista :>> ', respuesta.lista);
                    if (respuesta.exito) {
                        const examenesProgramados = respuesta.lista;
    
                        // Filtrar las clases programadas que no han pasado
                        const examenesValidos = examenesProgramados.filter(examen => {
                            const fechaHoraExamen = new Date(`${examen.fecha}T${examen.horaFinal}`);
                            const fechaHoraActual = new Date();
                            return fechaHoraExamen > fechaHoraActual;
                        });
                        setExamenProgramado(examenesValidos);
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
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "No se encontró el usuario",
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
                    text: 'Error al procesar la solicitud para listar los examenes programados',
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
                <div className='CenterTable'>
                    <table className='Table'>
                        <thead>
                            <tr>
                                <th style={{ width: '200px' }}>Día</th>
                                <th style={{ width: '200px' }}>Hora Inicial</th>
                                <th style={{ width: '200px' }}>Hora Final</th>
                                <th style={{ width: '200px' }}>Descripcion</th>
                                <th style={{ width: '200px' }}>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {examenesProgramados.map((examenProgramado) => (
                                <tr key={examenProgramado.id}>
                                    <td>{examenProgramado.fecha}</td>
                                    <td>{examenProgramado.horaInicial}</td>
                                    <td>{examenProgramado.horaFinal}</td>
                                    <td>{examenProgramado.unidad}</td>
                                    <td>{examenProgramado.estado}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <ButtonLink destino="/ProgramarClaseB2" clase="ButtonRegresar">Regresar</ButtonLink>
            </FullscreenCard>
        </motion.div>
    )
}

export default HorarioExamenB2