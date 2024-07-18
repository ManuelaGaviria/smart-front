import { useContext, useState } from "react";
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import ContenedorForms from "../../../../components/ContenedorForms";
import LabelInputEdit from "../../../../components/LabelInputEdit";
import Button from '../../../../components/Button';
import ButtonLink from '../../../../components/ButtonLink';
import { fetchBody } from '../../../../utils/fetch';
import GeneralContext from '../../../../context/GeneralContext';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from "../../../../components/Select";

function CrearExamenA1() {
  const navigate = useNavigate();
    useEffect(() => {
        const verificar = async () => {
            const respuesta = await fetchBody('/usuarios/', 'POST', {rol: "superadministrador"});
            if (respuesta.exito === false) {
                navigate("/")
            }
        }
        verificar();
    }, [])
  
  const { numero, descripcion, unidades, changeNumero, changeDescripcion, changeUnidades } = useContext(GeneralContext);
  const [clases, setClases] = useState([]);
  const [claseSeleccionada, setClaseSeleccionada] = useState("");

  useEffect(() => {
    const listClases = async () => {
      try {
        const respuesta = await fetchBody('/niveles/obtenerClase', 'POST', {nivel: "A1"});
        if (respuesta.exito) {
          const clasesFormateadas = respuesta.lista.map(clase => ({
            nombre: clase.id,
            id: clase.id
          }));
          setClases(clasesFormateadas);
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
          text: 'Error al procesar la solicitud para listar las clases',
          customClass: {
            confirmButton: 'btn-color'
          },
          buttonsStyling: false
        });
      }
    }
    listClases();
  }, []);

  const handleChange = (e) => {
    setClaseSeleccionada(e.target.value); // Actualizar el estado con la clase seleccionada
    console.log('Clase seleccionada:', e.target.value);
  };


  async function validate() {
    if (numero === "" || unidades === "" || descripcion ==="" || claseSeleccionada === "" ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor llena todos los campos.",
        customClass: {
          confirmButton: 'btn-color'
        },
        buttonsStyling: false
      });
    } else {
        const data = {
          numero: numero,
          unidades: unidades,
          tematica: descripcion,
          clase: claseSeleccionada,
          nivel: "A1"
        };
        console.log(data);
        try {
          const respuesta = await fetchBody('/niveles/agregarExamen', 'POST', data);
          console.log(respuesta);
          if (respuesta.exito) {
            document.getElementById("idExamen").value = "";
            document.getElementById("idUnidades").value = "";
            document.getElementById("idTematica").value = "";
            Swal.fire({
              icon: "success",
              title: "Examen creado con éxito!",
              customClass: {
                confirmButton: 'btn-color'
              },
              buttonsStyling: false
            });
            navigate("/GestionarExamenA1");
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
            text: 'Error al procesar la solicitud para crear un examen',
            customClass: {
              confirmButton: 'btn-color'
            },
            buttonsStyling: false
          });
        }
    }
  }

  return (
    <motion.div className="login-container"
      initial={{ opacity: 0, x: -1000 }} // Inicia desde la izquierda
      animate={{ opacity: 1, x: 0 }} // Animación hacia la derecha
      exit={{ opacity: 0, x: 1000 }} // Sale hacia la derecha
      transition={{ duration: 1 }}>
      <ContenedorForms>
        <h1>Crear Examen A1</h1>
        <div className="InputContainer">
          <LabelInputEdit id="idExamen" tipo="number" texto="Examen #" eventoCambio={changeNumero} ></LabelInputEdit>
          <LabelInputEdit id="idUnidades" eventoCambio={changeUnidades} texto="Unidades"></LabelInputEdit>
          <LabelInputEdit id="idTematica" texto="Temática" eventoCambio={changeDescripcion}></LabelInputEdit>
          <Select titulo="Clase que lo desbloquea"
                opciones={clases}
                eventoCambio={handleChange}>
          </Select>
        </div>
        <br />
        <Button eventoClick={validate} clase="Button">Crear</Button>
        <ButtonLink destino="/GestionarExamenA1" clase="Button">Regresar</ButtonLink>
      </ContenedorForms>
    </motion.div>
  );
}

export default CrearExamenA1;
