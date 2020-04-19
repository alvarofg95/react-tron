import React, { useEffect, useRef, Fragment } from 'react';
import { UNIT, BOARD_SIZE, GAME_READY } from 'config/const';

export default ({ players, gameStatus }) => {
  const canvasRef = useRef();
  useEffect(() => {
    if (gameStatus === GAME_READY) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, BOARD_SIZE, BOARD_SIZE);

      context.beginPath();
      context.strokeStyle = '#001900';
      for (let i = UNIT * 2; i <= BOARD_SIZE; i += UNIT * 2) {
        context.moveTo(i, 0);
        context.lineTo(i, BOARD_SIZE);
      }
      for (let i = UNIT * 2; i <= BOARD_SIZE; i += UNIT * 2) {
        context.moveTo(0, i);
        context.lineTo(BOARD_SIZE, i);
      }
      context.stroke();
      context.closePath();
    }
  }, [gameStatus]);

  useEffect(() => {
    const context = canvasRef.current.getContext('2d');
    players.forEach((player) => {
      context.fillStyle = player.color;
      context.fillRect(player.position.x, player.position.y, UNIT, UNIT);
    });
  }, [players]);

  return (
    <>
      <canvas id="board" className="board" ref={canvasRef} width={BOARD_SIZE} height={BOARD_SIZE} />
      <div className="instructions">
        {players.map((player) => (
          <div
            className="instructions__player"
            style={{ color: player.color }}
            key={`player--${player.id}`}
          >
            {`${player.id}: ${player.instructions}`}
          </div>
        ))}
      </div>
    </>
  );
};
