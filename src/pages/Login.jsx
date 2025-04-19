import React, { useState } from 'react';
import { useContext } from "react"
import { useNavigate } from 'react-router-dom';
import { motion} from 'framer-motion';
import Logo from '../components/Logo';
import Contenedor from '../components/Contenedor';
import LabelInput from '../components/LabelInput';
import GeneralContext from '../context/GeneralContext';
import ButtonLink from '../components/ButtonLink';
import Button from '../components/Button';
import { fetchBody } from '../utils/fetch';
import Swal from 'sweetalert2';
import LabelInputIcon from '../components/LabelInputIcon';

function Login() {
  const navigate = useNavigate();
  const {password, changePassword, correo, changeCorreo} = useContext (GeneralContext)

  const [logoAnimationComplete, setLogoAnimationComplete] = useState(false);
  const [animateContenedor, setAnimateContenedor] = useState(false);

  const handleLogoAnimationComplete = () => {
    setLogoAnimationComplete(true);
    setAnimateContenedor(true); // Indica que el contenedor debe animarse
  };

  async function validateLogin () {
    if (correo === "" || password === "" ) {
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
        correo: correo,
        contrasena: password
      };
      try {
        const respuesta = await fetchBody('/usuarios/login', 'POST', data);
        if (respuesta.exito) {
          localStorage.setItem("token", respuesta.token);
          const rolUsuario = JSON.parse(atob(localStorage.getItem("token").split('.')[1])).rol;
          if (rolUsuario === "administrador") {
            navigate("/Admin")
          } else if (rolUsuario === "superadministrador") {
            navigate("/Administrador")
          } else if (rolUsuario === "profesor") {
            navigate("/Teacher")
          } else if (rolUsuario === "estudiante") {
            navigate("/Student")
          } else {
            navigate("/")
          }
        } else if (respuesta.reason === "Inactivado") {
          Swal.fire({
            icon: "error",
            title: "Usuario inactivo",
            text: 'El usuario fue inactivado, si fue un error comunícate con el administrador.',
            customClass: {
              confirmButton: 'btn-color'
            },
            buttonsStyling: false
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: 'El usuario no existe o la contraseña no coincide',
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
          text: 'Error al procesar la solicitud para ingresar',
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
      <Logo onAnimationComplete={handleLogoAnimationComplete}></Logo>
      {logoAnimationComplete && (
        <Contenedor animate={animateContenedor}>
          <h1>Iniciar Sesión</h1>
          <div className="InputContainer">
            <LabelInput texto="Correo" eventoCambio={changeCorreo}></LabelInput>
            <LabelInputIcon texto="Contraseña" eventoCambio={changePassword}></LabelInputIcon>
          </div>
          <ButtonLink destino="/ResetPassword" clase="ButtonNav">¿Olvidaste tu contraseña?</ButtonLink>
          <br />
          <Button eventoClick={validateLogin} clase="Button">Iniciar Sesión</Button>
        </Contenedor>
      )}
    </motion.div>
  );
}

export default Login;