import { motion } from 'framer-motion';
import Logo2 from '../components/Logo2';
import Button from '../components/Button';
import { fetchGet } from '../utils/fetch';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import ButtonLink from '../components/ButtonLink';

function Reportes() {
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

    async function estudiantesInactivos() {
        const respuesta = await fetchGet('/reportes/estudiantesInactivosPotenciales');
        if (!respuesta.exito) {
            Swal.fire({ icon: "error", title: "Error", text: respuesta.error });
            return;
        }

        const archivo = await fetchGet('/reportes/obtenerUrlReporteEstudiantesInactivos');
        if (!archivo.exito) {
            Swal.fire({ icon: "error", title: "Error", text: archivo.error });
            return;
        }

        // Abrir el Excel en otra pestaña
        window.open(archivo.archivoUrl, '_blank');
    }

    async function desbalanceReporte() {
        const respuesta = await fetchGet('/reportes/promediosExamenOralEscrito');
        if (!respuesta.exito) {
            Swal.fire({ icon: "error", title: "Error", text: respuesta.error });
            return;
        }

        const archivo = await fetchGet('/reportes/obtenerUrlReportePromedios');
        if (!archivo.exito) {
            Swal.fire({ icon: "error", title: "Error", text: archivo.error });
            return;
        }

        // Abrir el Excel en otra pestaña
        window.open(archivo.archivoUrl, '_blank');
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
                        <div className="tooltip">
                            <Button clase="Button" eventoClick={intentosExamen}>
                                Examen con más intentos
                            </Button>
                            <span className="tooltiptext">
                                <div className="descripcionReporte">
                                    <p className="descripcion">
                                        Este reporte permite identificar cuáles exámenes presentan mayor dificultad para <br></br> los estudiantes, mostrando en qué puntos del proceso académico se estancan  con <br></br> más frecuencia.
                                    </p>
                                    <p> A partir de esta información, se pueden tomar decisiones pedagógicas como: </p>
                                    <ul>
                                        <li>Reforzar contenidos</li>
                                        <li>Ajustar la dificultad de las preguntas</li>
                                        <li>Implementar talleres de apoyo</li>
                                    </ul>
                                </div>
                            </span>
                        </div>
                        <div className="tooltip">
                            <Button clase="Button" eventoClick={estudiantesInactivos}>
                                Estudiantes Inactivos
                            </Button>
                            <span className="tooltiptext">
                                <div className="descripcionReporte">
                                    <p className="descripcion">
                                        Este reporte lista a los estudiantes que no han accedido recientemente al sistema o <br></br> que no han programado clases o exámenes en un tiempo determinado.
                                    </p>
                                    <p>
                                        Es útil para que el área administrativa o comercial pueda:
                                    </p>
                                    <ul>
                                        <li>Hacer seguimiento personalizado</li>
                                        <li>Establecer contacto con estos estudiantes</li>
                                        <li>Comprender las razones de su inactividad</li>
                                        <li>Fomentar la retención y continuidad académica</li>
                                    </ul>
                                </div>
                            </span>

                        </div>
                        <div className='tooltip'>
                            <Button clase="Button" eventoClick={desbalanceReporte}>
                                Desbalance de examenes
                            </Button>
                            <span className="tooltiptext">
                                <div className="descripcionReporte">
                                    <p className="descripcion">
                                        Este reporte muestra el rendimiento promedio de los estudiantes en cada nivel del <br></br> curso,
                                        diferenciando entre las notas obtenidas en el examen oral y en el examen <br></br> escrito.
                                    </p>
                                    <p>
                                        Sirve para detectar si existe un desequilibrio en la exigencia entre ambos tipos de <br></br> evaluación
                                        o si hay algún patrón de bajo rendimiento asociado a un tipo específico <br></br> de examen.
                                    </p>
                                </div>
                            </span>
                        </div>
                        <ButtonLink destino="/Admin" clase="ButtonRegresar">Regresar</ButtonLink>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default Reportes;