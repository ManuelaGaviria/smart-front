import React, { useState } from 'react';
import Logo from '../components/Logo';
import Contenedor from '../components/Contenedor';

function Login() {
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
        <Contenedor animate={animateContenedor}>Holi</Contenedor>
      )}
    </div>
  );
}

export default Login;