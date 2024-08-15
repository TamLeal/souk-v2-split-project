import React from 'react';

const FlipNumber = ({ value }) => (
  <div className="flip-number flex justify-center">
    {/* Renderizar o valor inteiro sem dividi-lo em dígitos individuais */}
    <div className="digit mx-1">
      {value}
    </div>
  </div>
);

export default FlipNumber;
