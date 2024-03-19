import React, { useState } from 'react';
import { useContext, useEffect } from "react"
import { useLocation, useNavigate } from 'react-router-dom';
import { motion} from 'framer-motion';
import Logo from '../components/Logo';
import Contenedor from '../components/Contenedor';
import LabelInput from '../components/LabelInput';
import GeneralContext from '../context/GeneralContext';
import ButtonLink from '../components/ButtonLink';
import Button from '../components/Button';

function Login() {
  const navigate = useNavigate();
  const {changeName, changePassword} = useContext (GeneralContext)

  const [logoAnimationComplete, setLogoAnimationComplete] = useState(false);
  const [animateContenedor, setAnimateContenedor] = useState(false);

  const handleLogoAnimationComplete = () => {
    setLogoAnimationComplete(true);
    setAnimateContenedor(true); // Indica que el contenedor debe animarse
  };

  function validateLogin () {
    navigate('/Admin')
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
            <LabelInput texto="Usuario" eventoCambio={changeName}></LabelInput>
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