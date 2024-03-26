import Logo from '../components/Logo'
import LabelInput from '../components/LabelInput';
import Contenedor from '../components/Contenedor';
import Button from '../components/Button';
import GeneralContext from '../context/GeneralContext';
import React, { useState } from 'react';
import { useContext } from "react"
import ButtonLink from '../components/ButtonLink';
import { motion} from 'framer-motion';
import { fetchBody } from '../utils/fetch';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
  const navigate = useNavigate();
    const {correo, changeCorreo} = useContext (GeneralContext)

    const [logoAnimationComplete, setLogoAnimationComplete] = useState(false);
    const [animateContenedor, setAnimateContenedor] = useState(false);

    const handleLogoAnimationComplete = () => {
        setLogoAnimationComplete(true);
        setAnimateContenedor(true); // Indica que el contenedor debe animarse
    };

    async function validate() {
      if (correo === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Por favor llena todos los campos",
          customClass: {
            confirmButton: 'btn-color'
          },
          buttonsStyling: false
        });
      } else {
        const data = {
          correo: correo
        };
        const respuesta = await fetchBody('/usuarios/reset', 'POST', data);
        if (respuesta.exito) {
          Swal.fire({
            icon: "success",
            title: "Contraseña Recuperada",
            text: 'Revisa tu correo para verificar tu nueva contraseña',
            customClass: {
              confirmButton: 'btn-color'
            },
            buttonsStyling: false
          });
          navigate("/")
        }
      }
    }
  return (
    <motion.div className="login-container"
    initial={{ opacity: 0, x: -1000 }} // Inicia desde la izquierda
    animate={{ opacity: 1, x: 0 }} // Animación hacia la derecha
    exit={{ opacity: 0, x: 1000 }} // Sale hacia la derecha
    transition={{ duration: 1 }}>
      <Logo onAnimationComplete={handleLogoAnimationComplete}></Logo>
      {logoAnimationComplete && (
        <Contenedor animate={animateContenedor}>
          <h1>Recuperar Contraseña</h1>
          <div className="InputContainer">
            <LabelInput texto="Correo" eventoCambio={changeCorreo}></LabelInput>
          </div>
          <br />
          <Button eventoClick={validate} clase="Button">Recuperar Contraseña</Button>
          <ButtonLink destino="/" clase="Button">Regresar</ButtonLink>
        </Contenedor>
      )}
    </motion.div>
  )
}

export default ResetPassword