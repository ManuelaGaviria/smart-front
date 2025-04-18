import React, { useEffect, useState, useRef } from 'react';
import NavMenu from "../../../../components/NavMenu";
import ContentCard from "../../../../components/ContentCard";
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchBody } from "../../../../utils/fetch";
import Swal from 'sweetalert2';

function NavPageB2() {
  const navigate = useNavigate();

  const [timeLeft, setTimeLeft] = useState(3000); // ✅ Solo una vez

  // ⏳ UseEffect para el temporizador
  useEffect(() => {
    if (timeLeft <= 0) {
      finalizarExamenTimer();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]); // ✅ Correcto

  const finalizarExamenTimer = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se encontró un token de autenticación. Inicia sesión nuevamente.',
        customClass: { confirmButton: 'btn-color' },
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

    console.log(respuestasFinales);

    const dataExamen = {
      examenId,
      idEstudiante,
      nivel: 'B2',
      preguntaRespuesta: respuestasFinales,
    };

    try {
      const respuesta = await fetchBody('/estudiantes/realizarExamenEscrito', 'POST', dataExamen);

      if (respuesta.exito) {
        Swal.fire({
          icon: 'success',
          title: 'Tiempo finalizado',
          text: 'Tu examen ha sido enviado automáticamente.',
          customClass: { confirmButton: 'btn-color' },
          buttonsStyling: false,
        });

        navigate('/ExamenEscritoB2'); // ✅ Redirigir a la página de inicio solo si la respuesta es exitosa
      } else {
        throw new Error(respuesta.error || 'Error desconocido al procesar el examen.');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al finalizar el examen. Intenta nuevamente.',
        customClass: { confirmButton: 'btn-color' },
        buttonsStyling: false,
      });
    }
  };

  useEffect(() => {
    const verificar = async () => {
      const respuesta = await fetchBody('/usuarios/', 'POST', { rol: "estudiante" });
      if (respuesta.exito === false) {
        navigate("/", { replace: true });
      }
    }
    verificar();
  }, [navigate]);

  useEffect(() => {
    // Bloquear el botón de retroceso
    const bloquearRetroceso = () => {
      window.history.pushState(null, document.title, window.location.href);
      Swal.fire({
        icon: "warning",
        title: "Acción no permitida",
        text: "No puedes regresar mientras realizas el examen.",
        customClass: {
          confirmButton: 'btn-color',
        },
        buttonsStyling: false,
      });
    };

    // Bloquear recarga de página
    const bloquearRecarga = (event) => {
      event.preventDefault();
      event.returnValue = ''; // Requerido para mostrar la alerta de confirmación del navegador
    };

    // Agregar un estado al historial y bloquear retroceso
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener("popstate", bloquearRetroceso);
    window.addEventListener("beforeunload", bloquearRecarga);

    return () => {
      window.removeEventListener("popstate", bloquearRetroceso); // Limpiar evento al desmontar
      window.removeEventListener("beforeunload", bloquearRecarga); // Limpiar evento al desmontar
    };
  }, []);

  const location = useLocation();
  const { examenId } = location.state || {}; // Obteniendo el examenId del estado

  const [data, setData] = useState([]);
  const [currentElement, setCurrentElement] = useState(0);
  const [answers, setAnswers] = useState({}); // Respuestas seleccionadas por pregunta
  const solicitudRealizada = useRef(false);


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
   
    const obtenerPreguntas = async () => {
     
      try {
       
        const respuesta = await fetchBody('/estudiantes/getPreguntasExamen', 'POST', { nivel: "B2", examenId: examenId });
        if (respuesta.exito) {
          const preguntas = respuesta.examen;
          console.log("holi");
          console.log('preguntas :>> ', preguntas);
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
      console.log('respuestasFinales :>> ', respuestasFinales);
   
      const dataExamen = {
        examenId,
        idEstudiante,
        nivel: 'B2',
        preguntaRespuesta: respuestasFinales,
      };

      const respuesta = await fetchBody('/estudiantes/realizarExamenEscrito', 'POST', dataExamen);

      if (respuesta.exito) {
      
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

        navigate('/NotasB2');
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
          {/* ⏳ Temporizador en pantalla */}

          <div className='finalizarExamen'>
            <div className="timerContainer">
              <p>Tiempo restante: <strong>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</strong></p>
            </div>
            <button className="ButtonFinalizar" onClick={finalizarExamen}>
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

export default NavPageB2