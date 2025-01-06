import React, { useEffect, useState, useRef } from 'react';
import NavMenu from "../../../../components/NavMenu";
import ContentCard from "../../../../components/ContentCard";
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchBody } from "../../../../utils/fetch";
import Swal from 'sweetalert2';

function NavPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { examenId } = location.state || {}; // Obteniendo el examenId del estado

  // Puedes utilizar examenId en tu lógica
  console.log("Examen ID:", examenId);

  const [data, setData] = useState([]);
  const [currentElement, setCurrentElement] = useState(0);
  const [answers, setAnswers] = useState({}); // Respuestas seleccionadas por pregunta
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


  const handleNext = () => {
    if (currentElement < data.length - 1) {
      setCurrentElement((prev) => prev + 1);
    }
  };

  const handleAnswer = (questionTitle, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionTitle]: answer, // Usar el título de la pregunta como clave
    }));
  };

  const finalizarExamen = async () => {
    // Validar que todas las preguntas estén respondidas
    if (Object.keys(answers).length !== data.length) {
      Swal.fire({
        icon: 'warning',
        title: 'Faltan preguntas por responder',
        text: 'Por favor, responde todas las preguntas antes de finalizar el examen.',
        customClass: {
          confirmButton: 'btn-color',
        },
        buttonsStyling: false,
      });
      return; // Salir del método si no se han respondido todas las preguntas
    }
  
    try {
      // Confirmación del usuario
      const confirmacion = await Swal.fire({
        title: '¿Estás seguro de terminar el examen?',
        text: 'Esta acción no se puede revertir',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Terminar',
        customClass: {
          confirmButton: 'btn-color',
          cancelButton: 'btn-color-cancel',
        },
        buttonsStyling: false,
      });
  
      if (!confirmacion.isConfirmed) return;
  
      const token = localStorage.getItem('token');
  
      if (!token) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se encontró un token de autenticación. Inicia sesión nuevamente.',
          customClass: {
            confirmButton: 'btn-color',
          },
          buttonsStyling: false,
        });
        return;
      }
  
      const payload = JSON.parse(atob(token.split('.')[1]));
      const idEstudiante = payload.id;
  
      // Mapear las preguntas con sus respuestas seleccionadas
      const respuestasFinales = data.map((pregunta) => ({
        idPregunta: pregunta.idPregunta,
        respuestaDada: answers[pregunta.pregunta] || '', // Usar respuesta si existe, o vacío
      }));
  
      console.log('Respuestas que se enviarán al backend:', respuestasFinales);
  
      const dataExamen = {
        examenId,
        idEstudiante,
        nivel: 'A1',
        preguntaRespuesta: respuestasFinales,
      };
  
      const respuesta = await fetchBody('/estudiantes/realizarExamenEscrito', 'POST', dataExamen);
  
      if (respuesta.exito) {
        console.log(respuesta.examenEscrito);
        const { respuestasCorrectas, totalPreguntas } = respuesta.examenEscrito;
  
        Swal.fire({
          icon: 'success',
          title: '¡Terminaste el examen con éxito!',
          text: `Sacaste ${respuestasCorrectas}/${totalPreguntas} correctas.`,
          customClass: {
            confirmButton: 'btn-color',
          },
          buttonsStyling: false,
        });
  
        navigate('/NotasA1');
      } else {
        throw new Error(respuesta.error || 'Error desconocido al procesar el examen.');
      }
    } catch (error) {
      console.error('Error al finalizar el examen:', error);
  
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al finalizar el examen. Intenta nuevamente.',
        customClass: {
          confirmButton: 'btn-color',
        },
        buttonsStyling: false,
      });
    }
  };  

  // Verificar si todas las preguntas han sido respondidas
  const allQuestionsAnswered = Object.keys(answers).length === data.length;

  return (
    <div>

      <div className='doubleColumnMain'>
        <div className='menuDivAdmin'>
          <NavMenu
            data={data}
            navState={setCurrentElement}
            currentElement={currentElement}
            answeredQuestions={answers}
          />
        </div>
        <div className='preguntasContainer'>
          <div className='finalizarExamen'>
            <button className="finalizeButton" onClick={finalizarExamen}>
              Finalizar
            </button>
          </div>
          <div className="mainContainer">
            {data.length > 0 && data[currentElement] ? (
              <>
                <ContentCard
                  data={data[currentElement]}
                  onAnswer={handleAnswer}
                  selectedAnswer={answers[data[currentElement].pregunta]} // Pasar la respuesta seleccionada
                />
                {/* Mostrar el botón solo si no todas las preguntas han sido respondidas */}
                {!allQuestionsAnswered && (
                  <button
                    className="nextButton"
                    onClick={handleNext}
                    disabled={currentElement === data.length - 1}
                  >
                    Siguiente
                  </button>
                )}
              </>
            ) : (
              <p>Cargando preguntas...</p>
            )}
          </div>

        </div>
      </div>
    </div>

  )
}

export default NavPage