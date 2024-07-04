import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Logo3 from '../../../../components/Logo3';
import { motion } from 'framer-motion';
import FullscreenCard from '../../../../components/FullScreenCard';
import ButtonLink from '../../../../components/ButtonLink';
import { fetchBody } from '../../../../utils/fetch';
import ContenedorForms from '../../../../components/ContenedorForms';
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

function VerClaseA1() {
    const navigate = useNavigate();

    useEffect(() => {
        const verificar = async () => {
            const respuesta = await fetchBody('/usuarios/', 'POST', {rol: "superadministrador"});
            if (respuesta.exito === false) {
                navigate("/")
            }
        }
        verificar();
    }, [navigate]);

    return (
        <motion.div
            className='ContainerFull'
            initial={{ opacity: 0, x: 1000 }} // Inicia desde la derecha
            animate={{ opacity: 1, x: 0 }} // Animación hacia la izquierda
            exit={{ opacity: 0, x: -1000 }} // Sale hacia la izquierda
            transition={{ duration: 1 }}>
            <Logo3 />
            <FullscreenCard>
                <div className='CenterTable'>
                    <table className='Table'>
                        <thead>
                            <tr>
                                <th style={{ width: '200px' }}>Código</th>
                                <th style={{ width: '200px' }}>Clase #</th>
                                <th style={{ width: '200px' }}>Descripción</th>
                                <th style={{ width: '200px' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>INGA1</td>
                                <td>1</td>
                                <td>Pasado Simple</td>
                                <td>Clase 3</td>
                                <td>
                                    <button className='btn-edit'><MdModeEdit /></button>
                                    <button className='btn-delete'><MdDelete /></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <ButtonLink destino="/ProgramarA1" clase="ButtonRegresar">Regresar</ButtonLink>
            </FullscreenCard>
        </motion.div>
    );
}

export default VerClaseA1;
