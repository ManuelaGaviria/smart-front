import React, { useState } from 'react';
import { useContext, useEffect } from "react"
import Logo from '../components/Logo';
import Contenedor from '../components/Contenedor';
import LabelInput from '../components/LabelInput';
import GeneralContext from '../context/GeneralContext';
import ButtonLink from '../components/ButtonLink';
import Button from '../components/Button';

function Login() {
  const {changeName, changePassword} = useContext (GeneralContext)

  const [logoAnimationComplete, setLogoAnimationComplete] = useState(false);
  const [animateContenedor, setAnimateContenedor] = useState(false);

  const handleLogoAnimationComplete = () => {
    setLogoAnimationComplete(true);
    setAnimateContenedor(true); // Indica que el contenedor debe animarse
  };

  return (
    <div className="login-container">
      <Logo onAnimationComplete={handleLogoAnimationComplete}></Logo>
      {logoAnimationComplete && (
        <Contenedor animate={animateContenedor}>
          <h1>Iniciar Sesión</h1>
          <div className="InputContainer">
            <LabelInput texto="Usuario" eventoCambio={changeName}></LabelInput>
            <LabelInput tipo="password" texto="Contraseña" eventoCambio={changePassword}></LabelInput>
          </div>
          <ButtonLink clase="ButtonNav">¿Olvidaste tu contraseña?</ButtonLink>
          <br />
          <Button clase="Button">Iniciar Sesión</Button>
        </Contenedor>
      )}
    </div>
  );
}

export default Login;