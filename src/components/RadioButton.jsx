import React from 'react';

const RadioButton = ({ id, label }) => {

  return (
    <div className='radioButton'>
      <input type="radio" id={id}/>
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

export default RadioButton;
