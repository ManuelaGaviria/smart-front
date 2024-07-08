import { useContext, useState } from "react";
import GeneralContext from "../../../../context/GeneralContext";
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import ContenedorForms from "../../../../components/ContenedorForms";
import LabelInputEdit from "../../../../components/LabelInputEdit";
import Button from '../../../../components/Button';
import ButtonLink from '../../../../components/ButtonLink';
import { fetchBody } from '../../../../utils/fetch';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CrearClaseA1() {
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


  const [codigo, setCodigo] = useState("")
    const changeCodigo = (e) => {
        setCodigo(e.target.value)
    }

    const { numero, changeNumero, descripcion, changeDescripcion } = useContext(GeneralContext);



  async function validate() {
    if (codigo === "" || numero === "" || descripcion === "") {
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
          codigo: codigo,
          numero: numero,
          descripcion: descripcion,
          nivel: "A1"
        };
        console.log(data);
        try {
          const respuesta = await fetchBody('/niveles/agregarClase', 'POST', data);
          console.log(respuesta);
          if (respuesta.exito) {
            document.getElementById("idCodigo").value = "";
            document.getElementById("idNumero").value = "";
            document.getElementById("idDescripcion").value = "";
            Swal.fire({
              icon: "success",
              title: "Clase creada con éxito!",
              customClass: {
                confirmButton: 'btn-color'
              },
              buttonsStyling: false
            });
            navigate("/GestionarClaseA1");
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
            text: 'Error al procesar la solicitud para crear una clase',
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
        <h1>Crear Clases A1</h1>
        <div className="InputContainer">
          <LabelInputEdit id="idCodigo" texto="Código" eventoCambio={changeCodigo} ></LabelInputEdit>
          <LabelInputEdit id="idNumero" tipo="number" eventoCambio={changeNumero} texto="Clase #"></LabelInputEdit>
          <LabelInputEdit id="idDescripcion" texto="Descripción" eventoCambio={changeDescripcion}></LabelInputEdit>
        </div>
        <br />
        <Button eventoClick={validate} clase="Button">Crear</Button>
        <ButtonLink destino="/GestionarClaseA1" clase="Button">Regresar</ButtonLink>
      </ContenedorForms>
    </motion.div>
  );
}

export default CrearClaseA1;
