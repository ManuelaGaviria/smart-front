import { useContext } from "react";
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
  
  const { name } = useContext(GeneralContext);



  async function validate() {
    if (name === "" ) {
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
          nombre: name
        };
        console.log(data);
        try {
          const respuesta = await fetchBody('/superadmin/niveles', 'POST', data);
          console.log(respuesta);
          if (respuesta.exito) {
            document.getElementById("idName").value = "";
            document.getElementById("idApellido").value = "";
            document.getElementById("idDocument").value = "";
            document.getElementById("idMail").value = "";
            document.getElementById("idDate").value = "";
            Swal.fire({
              icon: "success",
              title: "Administrador creado con éxito!",
              customClass: {
                confirmButton: 'btn-color'
              },
              buttonsStyling: false
            });
            navigate("/GestionarAdmins");
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
            text: 'Error al procesar la solicitud para crear un Administrador',
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
          <LabelInputEdit id="idCodigo" texto="Código" eventoCambio={name} ></LabelInputEdit>
          <LabelInputEdit id="idNumero" eventoCambio={name} texto="Clase #"></LabelInputEdit>
          <LabelInputEdit id="idDescripcion" texto="Descripción" eventoCambio={name}></LabelInputEdit>
        </div>
        <br />
        <Button eventoClick={validate} clase="Button">Crear</Button>
        <ButtonLink destino="/GestionarClaseA1" clase="Button">Regresar</ButtonLink>
      </ContenedorForms>
    </motion.div>
  );
}

export default CrearClaseA1;
