import {FaEye, FaEyeSlash } from "react-icons/fa";
import React, { useState } from 'react'

function LabelInputIcon({texto,eventoCambio}) {
    const [showPassword, setShowPassword] = useState(false);
    
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    return (
      <div className="mallaIcon">
          <div className="columnaIzquierda">
              <label className="label">{texto}</label>
          </div>
          <div className="columnaDerecha">
              <input className="input" type={showPassword ? "text" : "password"} onChange={eventoCambio}/>
              {showPassword ? (
                <FaEyeSlash className="eyesClose" onClick={togglePasswordVisibility} />
            ) : (
                <FaEye className="eyes" onClick={togglePasswordVisibility} />
            )}
          </div>
      </div>
    )
  }
  
  export default LabelInputIcon