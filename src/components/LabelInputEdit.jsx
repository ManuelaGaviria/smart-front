import { useEffect } from "react"

function LabelInputEdit({texto,tipo,eventoCambio, valorInicial, id, readOnly = false}) {

    useEffect(() => {
        document.getElementById(id).value = valorInicial;
        //eventoCambio(valorInicial);
    }, []);
    
    return (
      <div className="malla">
          <div className="columnaIzquierda">
              <label className="label">{texto}</label>
          </div>
          <div className="columnaDerecha">
              <input id={id} className={`input ${readOnly ? "readonly" : ""}`} type={tipo} onChange={eventoCambio} readOnly={readOnly}/>
          </div>
      </div>
    )
  }

  LabelInputEdit.defaultProps={
    valorInicial: ""
  }
  
  export default LabelInputEdit