import React from 'react'
import ButtonLink from './ButtonLink'
import { MdOutlineCancel } from "react-icons/md";

function ImageButton({texto, destino, icon}) {
    const Icon = icon || MdOutlineCancel
  return (
    <div className="malla">
        <div className="columnaIzquierda">
            <label className="labelCircle">
                <Icon className="icons" />
            </label>
        </div>
        <div className="columnaDerechaImageButton">
            <ButtonLink destino={destino} clase="ButtonNavImage">{texto}</ButtonLink>
        </div>
    </div>
  )
}

export default ImageButton