import { useState } from "react";
import NavMenu from "../../../../components/NavMenu";
import ContentCard from "../../../../components/ContentCard";

function NavPage() {

  const data = [
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
    },
    {
      id: 2,
      navText: 'Pregunta 3',
      text: 'Enunciado de prueba aún más distinto',
      option1: 'Opción A1',
      option2: 'Opción B1',
      state: false,
      answer: ''
    }
  ];

  const [currentElement, setCurrentElement] = useState(0);

  return (
    <div className='doubleColumnMain'>
        <div className='menuDivAdmin'>
          <NavMenu data={data} navState={setCurrentElement} />
        </div>
        <div className='mainContainer'>
          <ContentCard data={data[currentElement]} />
        </div>
    </div>
  )
}

export default NavPage