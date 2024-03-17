function LabelInputEdit({texto,tipo,eventoCambio, valorInicial}) {
    
    return (
      <div className="malla">
          <div className="columnaIzquierda">
              <label className="label">{texto}</label>
          </div>
          <div className="columnaDerecha">
              <input className="input" type={tipo} onChange={eventoCambio} value={valorInicial || ''}/>
          </div>
      </div>
    )
  }
  
  export default LabelInputEdit