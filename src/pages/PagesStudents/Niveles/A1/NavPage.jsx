import React, { useEffect, useState, useContext } from 'react';
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

  useEffect(() => {
    const obtenerPreguntas = async () => {
      try {
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
          <ContentCard data={data[currentElement]} />
        </div>
    </div>
  )
}

export default NavPage