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
    console.log(correo);
    console.log(password);
    if (correo === "" || password === "" ) {
      alert("Llena todos los campos")
    } else {
      const data = {
        correo: correo,
        contrasena: password
      };
      console.log(data);
      try {
        const respuesta = await fetchBody('/profesores/login', 'POST', data);
        if (respuesta.exito) {
          localStorage.setItem("token", respuesta.token);
          console.log(localStorage.getItem("token"));
          const rolUsuario = JSON.parse(atob(localStorage.getItem("token").split('.')[1])).rol;
          if (rolUsuario === "administrador") {
            navigate("/Admin")
          } else if (rolUsuario === "profesor") {
            navigate("/Teacher")
          } else if (rolUsuario === "estudiante") {
            navigate("/Student")
          } else {
            navigate("/")
          }
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
            <LabelInput tipo="password" texto="Contraseña" eventoCambio={changePassword}></LabelInput>
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