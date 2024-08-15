import React from 'react';

const FlipNumber = ({ value }) => (
  <div className="flip-number flex justify-center">
    {value
      .toString()
      .split('')
      .map((digit, index) => (
        <div key={index} className="digit mx-1">
          {digit}
        </div>
      ))}
  </div>
);

export default FlipNumber;
