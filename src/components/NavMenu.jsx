function NavMenu({data, navState}) {
    return (
      <div>
          {data.map((item) => (
              <div key={item.id} onClick={() => navState(item.id)}>
                  <label className="labelNavMenu">Pregunta {item.navText}</label>
                  <br />
              </div>
          ))}
      </div>
    )
  }
  
  const defaultFunction = (arg) => {console.log(arg);}
  
  NavMenu.defaultProps = {
      data: [
          {
              id: 0,
              navText: 'Pregunta 1',
              text: 'Enunciado de prueba',
              option1: 'Opción 1',
              option2: 'Opción 2',
              state: false,
              answer: ''
          },
          {
              id: 1,
              navText: 'Pregunta 2',
              text: 'Enunciado de prueba diferente',
              option1: 'Opción A',
              option2: 'Opción B',
              state: false,
              answer: ''
          }
      ],
      navState: defaultFunction
  }
  
  export default NavMenu