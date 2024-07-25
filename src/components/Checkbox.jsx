import React, { useState, useEffect } from 'react';

const Checkbox = ({ id, label, onChange, checked }) => {
    const [isChecked, setIsChecked] = useState(checked);

    useEffect(() => {
        setIsChecked(checked);
    }, [checked]);

    const handleCheckboxChange = () => {
        const newChecked = !isChecked;
        setIsChecked(newChecked);
        if (onChange) {
            onChange(newChecked); // Notificar al padre sobre el cambio
        }
    };

    return (
        <div className="custom-checkbox">
            <input
                type="checkbox"
                id={id}
                checked={isChecked}
                onChange={handleCheckboxChange}
            />
            <label htmlFor={id}>{label}</label>
        </div>
    );
};

export default Checkbox;
