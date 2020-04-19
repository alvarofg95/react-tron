import React from 'react';

export default ({ children, onClick }) => (
  <button className="button" onClick={onClick}>
    {children}
  </button>
);
