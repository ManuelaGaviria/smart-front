import React, { useState, useEffect } from "react";

function SelectEdit({ titulo, opciones, eventoCambio, valorInicial, id, readOnly = false }) {
    // Estado local para el valor seleccionado
    const [valor, setValor] = useState(valorInicial);

    // Actualizar el estado local cuando el valor inicial cambie
    useEffect(() => {
        setValor(valorInicial);
    }, [valorInicial]);

    // Manejar el cambio de selección
    const handleChange = (event) => {
        const newValue = event.target.value;
        setValor(newValue); // Actualizar el estado local
        eventoCambio(event); // Llamar al evento de cambio pasado como prop
    };

    return (
        <div className="malla">
            <div className="columnaIzquierda">
                <label className="label">{titulo}</label>
            </div>
            <div className="columnaDerecha">
                <select
                    id={id}
                    className={`select ${readOnly ? "readonly" : ""}`}
                    onChange={handleChange}
                    value={valor} // Establecer el valor del estado local aquí
                    disabled={readOnly} // ← Evita que el usuario edite la selección
                >
                    <option value="" disabled>Seleccione uno</option>
                    {opciones.map((item) => (
                        <option value={item.nombre} key={item.id}>
                            {item.nombre}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

const vacio = () => {};

SelectEdit.defaultProps = {
    titulo: "example",
    opciones: [
        { nombre: "example1", id: 0 },
        { nombre: "example2", id: 1 },
        { nombre: "example3", id: 2 }
    ],
    eventoCambio: vacio
};

export default SelectEdit;
