import React, { useState } from 'react';

const RadioButton = ({ id, label }) => {
  const [checked, setChecked] = useState(false);

  const handleClick = () => {
    setChecked(!checked); // Cambia el estado
  };

  return (
    <div className='radioButton' onClick={handleClick}>
      <input
        type="radio"
        id={id}
        checked={checked}
        onChange={() => {}} 
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

export default RadioButton;


