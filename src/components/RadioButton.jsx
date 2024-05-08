import React from 'react';

const RadioButton = ({ id, label, checked, onChange }) => {
  const handleClick = () => {
    onChange(id);
  };

  return (
    <div className='radioButton' onClick={handleClick}>
      <input
        type="radio"
        id={id}
        checked={checked}
        onChange={() => {}}
        className='radio'
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

export default RadioButton;
