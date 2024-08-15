import React from 'react';

const FlipNumber = ({ value }) => (
  <div className="flip-number">
    {value
      .toString()
      .split('')
      .map((digit, index) => (
        <div key={index} className="digit">
          {digit}
        </div>
      ))}
  </div>
);

export default FlipNumber;
