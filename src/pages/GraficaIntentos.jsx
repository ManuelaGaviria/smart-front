import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { fetchGet } from '../utils/fetch';
import Swal from 'sweetalert2';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import ContenedorForms from '../components/ContenedorForms';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

function GraficaIntentos() {
    const [datosGrafica, setDatosGrafica] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                // Paso 1: generar el archivo
                const generado = await fetchGet('/reportes/intentosExamen');
                if (!generado.exito) {
                    Swal.fire({ icon: 'error', title: 'Error', text: generado.error });
                    return;
                }
    
                // Paso 2: obtener la URL firmada
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
        <>
            <div className="BackgroundOverlay" style={{ opacity: 0.5 }} />
            <ContenedorForms>
                <h2>Promedio de Intentos por Unidad</h2>
                {datosGrafica.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={datosGrafica}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="Nivel/Unidad" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="Promedio Intentos" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p>Cargando datos...</p>
                )}
                <br />
                <Button clase="Button" eventoClick={() => navigate(-1)}>Regresar</Button>
            </ContenedorForms>
        </>
    );
}

export default GraficaIntentos;