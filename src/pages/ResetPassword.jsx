import Logo from '../components/Logo'
import LabelInput from '../components/LabelInput';
import Contenedor from '../components/Contenedor';
import Button from '../components/Button';
import GeneralContext from '../context/GeneralContext';
import React, { useState } from 'react';
import { useContext, useEffect } from "react"
import ButtonLink from '../components/ButtonLink';

function ResetPassword() {
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
          <h1>Recuperar Contraseña</h1>
          <div className="InputContainer">
            <LabelInput texto="Correo" eventoCambio={changeName}></LabelInput>
          </div>
          <br />
          <Button clase="Button">Recuperar Contraseña</Button>
          <ButtonLink destino="/" clase="Button">Regresar</ButtonLink>
        </Contenedor>
      )}
    </div>
  )
}

export default ResetPassword