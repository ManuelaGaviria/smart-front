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

function VerExamenA1() {
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

    const [asignModalOpen, setAsignModalOpen] = useState(false);
    const [backgroundOpacity] = useState(0.5);

    const openAsignModal = () => {
        setAsignModalOpen(true);
    };

    const handleCloseModal = () => {
        setAsignModalOpen(false);
    };

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
                                <th style={{ width: '200px' }}>Examen #</th>
                                <th style={{ width: '200px' }}>Unidades</th>
                                <th style={{ width: '200px' }}>Temática</th>
                                <th style={{ width: '200px' }}>Clase que lo desbloquea</th>
                                <th style={{ width: '200px' }}>Examen Escrito</th>
                                <th style={{ width: '200px' }}>Examen Oral</th>
                                <th style={{ width: '200px' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Units 1&2</td>
                                <td>Pasado Simple</td>
                                <td>Clase 3</td>
                                <td>
                                    <ButtonLink destino="">Ver</ButtonLink>
                                </td>
                                <td>
                                    <ButtonLink destino="">Ver</ButtonLink>
                                </td>
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

            {asignModalOpen && (
                <>
                    <div
                    className="BackgroundOverlay"
                    style={{ opacity: backgroundOpacity }}
                    />
                    <ContenedorForms>
                        <h1>Editar Examen</h1>
                        
                    </ContenedorForms>
                </>
            )}
        </motion.div>
    );
}

export default VerExamenA1;
