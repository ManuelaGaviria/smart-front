import Logo from '../components/Logo'
import LabelInput from '../components/LabelInput';
import Contenedor from '../components/Contenedor';
import Button from '../components/Button';
import GeneralContext from '../context/GeneralContext';
import React, { useState } from 'react';
import { useContext, useEffect } from "react"
import ButtonLink from '../components/ButtonLink';
import { motion} from 'framer-motion';

function ResetPassword() {
    const {changeName, changePassword} = useContext (GeneralContext)

    const [logoAnimationComplete, setLogoAnimationComplete] = useState(false);
    const [animateContenedor, setAnimateContenedor] = useState(false);

    const handleLogoAnimationComplete = () => {
        setLogoAnimationComplete(true);
        setAnimateContenedor(true); // Indica que el contenedor debe animarse
    };
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
            <LabelInput texto="Correo" eventoCambio={changeName}></LabelInput>
          </div>
          <br />
          <Button clase="Button">Recuperar Contraseña</Button>
          <ButtonLink destino="/" clase="Button">Regresar</ButtonLink>
        </Contenedor>
      )}
    </motion.div>
  )
}

export default ResetPassword