
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Logo3 from '../../../../components/Logo3';
import { motion } from 'framer-motion';
import FullscreenCard from '../../../../components/FullScreenCard';
import ButtonLink from '../../../../components/ButtonLink';
import { fetchBody } from '../../../../utils/fetch';
import Swal from 'sweetalert2';

function HorarioC1() {

    const navigate = useNavigate();

    useEffect(() => {
        const verificar = async () => {
            const respuesta = await fetchBody('/usuarios/', 'POST', { rol: "estudiante" });
            if (respuesta.exito === false) {
                navigate("/")
            } else {
                listClasesProgramadas();
            }
        }
        verificar();
    }, [navigate]);

    const [clasesProgramadas, setClaseProgramada] = useState([]);

    async function listClasesProgramadas() {
        try {
            const token = localStorage.getItem("token");

            if (token) {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const idEst = payload.id;

                // Obtener la lista de clases disponibles
                const respuesta = await fetchBody('/estudiantes/listarClaseProgramada', 'POST', { idEstudiante: idEst, nivel: 'C1' });

                if (respuesta.exito) {
                    const clasesProgramadas = respuesta.lista;
                    // Filtrar las clases programadas que no han pasado
                    const clasesValidas = clasesProgramadas.filter(clase => {
                        const fechaHoraClase = new Date(`${clase.fecha}T${clase.horaFinal}`);
                        const fechaHoraActual = new Date();
                        return fechaHoraClase > fechaHoraActual;
                    });
                    setClaseProgramada(clasesValidas);
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
                text: 'Error al procesar la solicitud para listar las clases programadas',
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
                            {clasesProgramadas.map((claseProgramada) => (
                                <tr key={claseProgramada.id}>
                                    <td>{claseProgramada.fecha}</td>
                                    <td>{claseProgramada.horaInicial}</td>
                                    <td>{claseProgramada.horaFinal}</td>
                                    <td>{claseProgramada.id}</td>
                                    <td>{claseProgramada.estado}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <ButtonLink destino="/ProgramarClaseC1" clase="ButtonRegresar">Regresar</ButtonLink>
            </FullscreenCard>
        </motion.div>
    )
}

export default HorarioC1