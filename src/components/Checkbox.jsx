import React, { useState } from 'react';

const Checkbox = ({ id, label }) => {
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
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
