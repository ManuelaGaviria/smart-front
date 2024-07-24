import React, { useState, useEffect } from 'react';
import { format, addDays, isSunday } from 'date-fns';
import { es } from 'date-fns/locale';

const DateSelect = ({ onDateChange }) => {
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        const today = new Date();
        let tomorrow = addDays(today, 1);

        //Mira si hoy es sabado, y se saltea el domingo para colocar el lunes como segunda fecha
        if (today.getDay() === 6) {
            tomorrow = addDays(today, 2); // Skip Sunday
        }

        //Si hoy es domingo, solo coloca la fecha del lunes
        if (isSunday(today)) {
            setDates([addDays(today, 1)]);
        } else {
            setDates([today, tomorrow]);
        }
    }, []);

    const formatDate = (date) => {
        return format(date, 'EEEE dd MMMM yyyy', { locale: es });
    };

    const handleDateChange = (event) => {
        const selectedDate = new Date(event.target.value);
        setSelectedDate(selectedDate);
        onDateChange(selectedDate);
    };

    return (
        <select className="date-select" onChange={handleDateChange}>
            {dates.map((date, index) => (
                <option key={index} value={date}>
                    {formatDate(date)}
                </option>
            ))}
        </select>
    );
};

export default DateSelect;
