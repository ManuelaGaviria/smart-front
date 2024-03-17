import React from 'react';

function ButtonPages({ onClick, children, disabled }) {
  return (
    <button
      className={`button-pagination ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default ButtonPages;
