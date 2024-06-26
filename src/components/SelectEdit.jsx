import { useEffect } from "react";

function SelectEdit({ titulo, opciones, eventoCambio, valorInicial, id }) {
    useEffect(() => {
        document.getElementById(id).value = valorInicial;
    }, [valorInicial, id]);

    return (
        <div className="malla">
            <div className="columnaIzquierda">
                <label className="label">{titulo}</label>
            </div>
            <div className="columnaDerecha">
                <select
                    id={id}
                    className="select"
                    onChange={eventoCambio}
                    value={valorInicial} // Establecer el valor inicial aquí
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
