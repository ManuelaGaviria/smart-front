import React, { useEffect, useState, useRef } from 'react';
import NavMenu from "../../../../components/NavMenu";
import ContentCard from "../../../../components/ContentCard";
import { useLocation } from 'react-router-dom';
import { fetchBody } from "../../../../utils/fetch";
import Swal from 'sweetalert2';

function NavPage() {

  const location = useLocation();
  const { examenId } = location.state || {}; // Obteniendo el examenId del estado

  // Puedes utilizar examenId en tu lógica
  console.log("Examen ID:", examenId);

  const [data, setData] = useState([]);
  const solicitudRealizada = useRef(false);
  console.log("Antes del useEffect: examenId =", examenId);
  useEffect(() => {
    if (!examenId) {
      console.warn("Examen ID no disponible, evitando la ejecución del efecto.");
      return;
    }
    if (solicitudRealizada.current) {
      console.log("La solicitud ya se realizó, evitando ejecución redundante.");
      return;
    }
    solicitudRealizada.current = true;
    console.log("Entrando al useEffect con examenId:", examenId);
    const obtenerPreguntas = async () => {
      console.log("Payload enviado a fetchBody:", { nivel: "A1", examenId });
      try {
        console.log("Payload enviado a fetchBody:", { nivel: "A1", examenId });
        const respuesta = await fetchBody('/estudiantes/getPreguntasExamen', 'POST', { nivel: "A1", examenId: examenId });
        if (respuesta.exito) {
          const preguntas = respuesta.examen;
          console.log("holi");
          console.log(preguntas);
          setData(preguntas); // Guardar las preguntas en el estado
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
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: 'Error al procesar la solicitud para listar los examenes',
          customClass: {
            confirmButton: 'btn-color'
          },
          buttonsStyling: false
        });
      }
    }
    obtenerPreguntas();
  }, [examenId]);



  const [currentElement, setCurrentElement] = useState(0);

  return (
    <div className='doubleColumnMain'>
        <div className='menuDivAdmin'>
          <NavMenu data={data} navState={setCurrentElement} />
        </div>
        <div className='mainContainer'>
        {data.length > 0 && data[currentElement] ? (
          <ContentCard data={data[currentElement]} />
        ) : (
          <p>Cargando preguntas...</p>
        )}
        </div>
    </div>
  )
}

export default NavPage