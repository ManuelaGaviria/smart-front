import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { fetchGet } from '../utils/fetch';
import Swal from 'sweetalert2';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import FullScreenCard from '../components/FullScreenCard';
import Logo3 from '../components/Logo3';
import ButtonLink from '../components/ButtonLink';

function GraficaIntentos() {
    const [datosGrafica, setDatosGrafica] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const generado = await fetchGet('/reportes/intentosExamen');
                if (!generado.exito) {
                    Swal.fire({ icon: 'error', title: 'Error', text: generado.error });
                    return;
                }

                const archivo = await fetchGet('/reportes/obtenerUrlReporteIntentos');
                if (!archivo.exito || !archivo.archivoUrl) {
                    Swal.fire({ icon: 'error', title: 'Error', text: archivo.error || 'No se pudo obtener la URL del Excel' });
                    return;
                }

                const res = await fetch(archivo.archivoUrl);
                const blob = await res.blob();
                const arrayBuffer = await blob.arrayBuffer();
                const workbook = XLSX.read(arrayBuffer, { type: 'array' });
                const hoja = workbook.Sheets[workbook.SheetNames[0]];
                const datos = XLSX.utils.sheet_to_json(hoja);

                setDatosGrafica(datos);
            } catch (error) {
                console.error('Error al leer el archivo Excel:', error);
                Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo leer el archivo Excel.' });
            }
        };

        cargarDatos();
    }, []);

    return (
        <div className="ContainerFull">
            <Logo3 />
            <FullScreenCard>
                <h2>Promedio de Intentos por Unidad</h2>
                <div className="CenterTable">
                
                    {datosGrafica.length > 0 ? (
                        <ResponsiveContainer width="80%" height={400}>
                            <BarChart
                                data={datosGrafica}
                                style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '8px' }}
                            >
                                <CartesianGrid stroke="#000000" strokeDasharray="3 3" />
                                <XAxis dataKey="Nivel/Unidad" stroke="#000000" />
                                <YAxis stroke="#000000" />
                                <Tooltip />
                                <Bar dataKey="Promedio Intentos" fill="#7FFFD4" /> 
                            </BarChart>
                        </ResponsiveContainer>

                    ) : (
                        <p>Cargando datos...</p>
                    )}


                    <br />

                </div>
                <br />
                <br />
                <ButtonLink destino="/Reportes" clase="ButtonRegresar">Regresar</ButtonLink>
            </FullScreenCard>
        </div>
    );
}

export default GraficaIntentos;