import React, { useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import Logo3 from '../../components/Logo3';
import { motion } from 'framer-motion';
import FullScreenCard from '../../components/FullScreenCard';
import { fetchBody } from '../../utils/fetch';
import { useNavigate } from 'react-router-dom';
import ButtonLink from '../../components/ButtonLink';
import ContenedorForms from '../../components/ContenedorForms';
import LabelInput from '../../components/LabelInput';
import Select from '../../components/Select';
import GeneralContext from '../../context/GeneralContext';

function CalificarExamen() {
  const navigate = useNavigate();

  const { documento, changeDocumento } = useContext(GeneralContext);

  const [examenes, setExamenes] = useState([]);
  const [examenHabilitado, setExamenHabilitado] = useState(false);
  const [examenSeleccionado, setExamenSeleccionado] = useState("");

  const [niveles, setNiveles] = useState("");

  const changeNiveles = (nivel) => {
    console.log('nivel :>> ', nivel);
    setNiveles(nivel); // Se asigna el valor directamente
  };


  const opcionesNiveles = [
    { nombre: 'A1', id: 1 },
    { nombre: 'A2', id: 2 },
    { nombre: 'B1', id: 3 },
    { nombre: 'B2', id: 4 },
    { nombre: 'C1', id: 5 }
  ];

  const obtenerExamenesPorNivel = async (nivelId) => {
    try {
      const respuesta = await fetchBody('/niveles/obtenerExamen', 'POST', { nivel: nivelId });

      if (respuesta.exito && respuesta.lista.length > 0) { // Solo habilitar si hay exámenes
        console.log('respuesta.lista :>> ', respuesta.lista);
        const examenesFormateados = respuesta.lista.map(examen => ({
          nombre: examen.id,
          id: examen.id
        }));
        setExamenes(examenesFormateados);
        setExamenHabilitado(true); // Ahora sí habilita el Select
      } else {
        setExamenHabilitado(false); // Asegura que si no hay exámenes, no se muestre el select
        Swal.fire({
          icon: "warning",
          title: "No hay exámenes disponibles",
          text: "No se encontraron exámenes para este nivel.",
          customClass: { confirmButton: 'btn-color' },
          buttonsStyling: false
        });
      }
    } catch (error) {
      setExamenHabilitado(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: 'Error al procesar la solicitud para listar los exámenes',
        customClass: { confirmButton: 'btn-color' },
        buttonsStyling: false
      });
    }
  };


  const handleChangeNivel = (e) => {
    const nivelSeleccionado = e.target.value;
    setNiveles(nivelSeleccionado); // Actualiza el estado de niveles correctamente
    obtenerExamenesPorNivel(nivelSeleccionado); // Llama a la API para obtener exámenes
  };

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

        {/* Contenedor del formulario encima de la tabla */}
        <div className="form-wrapper">
          <div className="form-container">
            {/* Fila de los filtros */}
            <div className="form-row">
              <LabelInput texto="Documento Estudiante" eventoCambio={changeDocumento} />

              <Select id="idNivel" titulo="Nivel" opciones={opcionesNiveles} eventoCambio={handleChangeNivel} />

              {examenHabilitado && examenes.length > 0 && (
                <Select id="idExamen" titulo="Examen" opciones={examenes} eventoCambio={(e) => setExamenSeleccionado(e.target.value)} />
              )}
            </div>

            {/* Fila del botón */}
            <div className="button-container">
              <button onClick={() => console.log("Filtrando examen...")} className="ButtonBuscar">
                Buscar
              </button>
            </div>
          </div>
        </div>

        {/* Tabla de resultados */}
        <div className="CenterTable">
          <table className="Table">
            <thead>
              <tr>
                <th style={{ width: '250px' }}>Examen</th>
                <th style={{ width: '250px' }}>Examen Escrito</th>
                <th style={{ width: '250px' }}>Examen Oral</th>
                <th style={{ width: '250px' }}>Retroalimentación</th>
              </tr>
            </thead>
            <tbody>
              {/* Aquí se llenarán los datos dinámicamente */}
            </tbody>
          </table>
        </div>

        <ButtonLink destino="/Teacher" clase="ButtonRegresar">Regresar</ButtonLink>

      </FullScreenCard>
    </motion.div>

  );
}

export default CalificarExamen;
