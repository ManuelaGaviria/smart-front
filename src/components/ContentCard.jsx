import React from 'react';
import { motion } from 'framer-motion';
import RadioButton from './RadioButton';

function ContentCard({ data, onAnswer, selectedAnswer }) {
  const handleSelectionChange = (id) => {
    onAnswer(data.pregunta, id); // Usar el título de la pregunta como clave
  };

  return (
    <motion.div
      key={'contentCard' + data.id}
      className="card"
      initial={{ opacity: 0, x: -1000 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -1000, transition: { duration: 0.5, delay: 0 } }}
      transition={{ duration: 0.5 }}
    >
      <h2>{data.pregunta}</h2>

      <RadioButton
        id="respuesta1"
        label={data.respuesta1}
        checked={selectedAnswer === 'respuesta1'}
        onChange={handleSelectionChange}
      />
      <RadioButton
        id="respuesta2"
        label={data.respuesta2}
        checked={selectedAnswer === 'respuesta2'}
        onChange={handleSelectionChange}
      />
      <RadioButton
        id="respuesta3"
        label={data.respuesta3}
        checked={selectedAnswer === 'respuesta3'}
        onChange={handleSelectionChange}
      />
      <RadioButton
        id="respuesta4"
        label={data.respuesta4}
        checked={selectedAnswer === 'respuesta4'}
        onChange={handleSelectionChange}
      />
    </motion.div>
  );
}

export default ContentCard;
