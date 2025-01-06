function NavMenu({ data, navState, currentElement, answeredQuestions }) {
    return (
      <div>
        {data.map((item, index) => (
          <div
            key={item.id}
            onClick={() => navState(index)} // Usa el índice para cambiar la pregunta actual
            className={`navItem ${
              currentElement === index ? 'current' : ''
            } ${answeredQuestions[item.pregunta] ? 'answered' : ''}`}
          >
            <label className="labelNavMenu">Pregunta {item.navText}</label>
            <br />
          </div>
        ))}
      </div>
    );
  }
  
  const defaultFunction = (arg) => {
    console.log(arg);
  };
  
  NavMenu.defaultProps = {
    data: [
      {
        id: 0,
        navText: 'Pregunta 1',
        text: 'Enunciado de prueba',
        option1: 'Opción 1',
        option2: 'Opción 2',
        state: false,
        answer: '',
      },
      {
        id: 1,
        navText: 'Pregunta 2',
        text: 'Enunciado de prueba diferente',
        option1: 'Opción A',
        option2: 'Opción B',
        state: false,
        answer: '',
      },
    ],
    navState: defaultFunction,
  };
  
  export default NavMenu;
  