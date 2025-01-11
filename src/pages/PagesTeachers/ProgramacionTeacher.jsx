import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Logo3 from '../../components/Logo3';
import { motion } from 'framer-motion';
import FullScreenCard from '../../components/FullScreenCard';
import { fetchBody } from '../../utils/fetch';
import GeneralContext from '../../context/GeneralContext';
import { useContext } from "react";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import Button from '../../components/Button';
import ContenedorForms from '../../components/ContenedorForms';
import ButtonLink from '../../components/ButtonLink';
import LabelInputEdit from '../../components/LabelInputEdit';
import { useNavigate } from 'react-router-dom';
import SelectEdit from '../../components/SelectEdit';
import { IoToday } from 'react-icons/io5';

function ProgramacionTeacher() {
    const navigate = useNavigate();
    useEffect(() => {
        const verificar = async () => {
            console.log("Verificación ejecutada");
            const respuesta = await fetchBody('/usuarios/', 'POST', { rol: "profesor" });
            if (respuesta.exito === false) {
                navigate("/")
            }
        }
        verificar();

    }, [])


    const [programaciones, setProgramacion] = useState([]);

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
                // Formatear la fecha a yyyy-MM-dd
                const formattedDate = today.toISOString().split('T')[0];
                const respuesta = await fetchBody('/profesores/listarProgramacion', 'POST', { fecha: formattedDate, idProfesor: idProfesor })
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
                                <th style={{ width: '250px' }}>Fecha</th>
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
                                    <td>{programacion.estudiante}</td>
                                    <td>{programacion.tipo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <ButtonLink destino="/Teacher" clase="ButtonRegresar">Regresar</ButtonLink>
            </FullScreenCard>
        </motion.div>
    );
}

export default ProgramacionTeacher;


