import React, { useEffect } from 'react'
import { fetchBody } from '../utils/fetch';
import { useNavigate } from 'react-router-dom';

function Student() {
    const navigate = useNavigate();
    useEffect(() => {
        const verificar = async () => {
            const respuesta = await fetchBody('/usuarios/', 'POST', {rol: "estudiante"});
            if (respuesta.exito === false) {
                navigate("/")
            }
        }
        verificar();
    }, [])
  return (
    <div>Student</div>
  )
}

export default Student