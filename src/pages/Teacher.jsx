import React, { useEffect } from 'react'
import { fetchBody } from '../utils/fetch';
import { useNavigate } from 'react-router-dom';

function Teacher() {
    const navigate = useNavigate();
    useEffect(() => {
        const verificar = async () => {
            const respuesta = await fetchBody('/usuarios/', 'POST', {rol: "profesor"});
            if (respuesta.exito === false) {
                navigate("/")
            }
        }
        verificar();
    }, [])
  return (
    <div>Teacher</div>
  )
}

export default Teacher