import React from 'react';
import Button from 'components/Button';

export default ({ onClick }) => (
  <div className="play-info">
    <Button onClick={onClick}>Comenzar</Button>
  </div>
);
