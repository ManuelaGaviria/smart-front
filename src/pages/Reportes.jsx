import { useState } from 'react';
import { motion } from 'framer-motion';
import Logo2 from '../components/Logo2';
import Button from '../components/Button';
import ContenedorForms from '../components/ContenedorForms';
import { fetchGet } from '../utils/fetch';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useNavigate } from 'react-router-dom';

function Reportes() {
    const [mostrarModal, setMostrarModal] = useState(false);
    const [datosGrafica, setDatosGrafica] = useState([]);
    const [backgroundOpacity] = useState(0.5);
    const navigate = useNavigate();

    async function intentosExamen() {
        const respuesta = await fetchGet('/reportes/intentosExamen');
        if (!respuesta.exito) {
            Swal.fire({ icon: "error", title: "Error", text: respuesta.error });
            return;
        }

        const archivo = await fetchGet('/reportes/obtenerUrlReporteIntentos');
        if (!archivo.exito) {
            Swal.fire({ icon: "error", title: "Error", text: archivo.error });
            return;
        }

        // Abrir el Excel en otra pestaña
        window.open(archivo.archivoUrl, '_blank');
        navigate('/GraficaIntentos');  
    }

    return (
        <motion.div
            className='AdminContainer'
            initial={{ opacity: 0, x: 1000 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -1000 }}
            transition={{ duration: 2 }}>
            <div className='logoAdminContainer'>
                <Logo2 />
            </div>
            <motion.div
                className='contentAdminContainer'
                initial={{ opacity: 0, y: -500 }}
                animate={{ opacity: 1, y: -50 }}
                exit={{ opacity: 0, y: 500 }}
                transition={{ duration: 1 }}
            >
                <div className='ButtonsAdminContainer'>
                    <h1>Sección de reportes</h1>
                    <div>
                        <Button clase="Button" eventoClick={intentosExamen}>
                            Examen con más intentos
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Modal estilo ContenedorForms */}
            {mostrarModal && (
                <>
                    <div className="BackgroundOverlay" style={{ opacity: backgroundOpacity }} />
                    <ContenedorForms>
                        <h2>Promedio de Intentos por Unidad</h2>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={datosGrafica}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="Nivel/Unidad" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="Promedio Intentos" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                        <br />
                        <Button clase="Button" eventoClick={() => setMostrarModal(false)}>Cerrar</Button>
                    </ContenedorForms>
                </>
            )}
        </motion.div>
    );
}

export default Reportes;