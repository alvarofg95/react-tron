import React, { useReducer } from 'react';
import './App.css';
import Board from 'components/Board';
import { PLAYER_ONE, PLAYER_TWO } from 'config/const';
import useInterval from 'hooks/useInterval';

const initialState = [PLAYER_ONE, PLAYER_TWO];

const updateGame = (players, action) => {
  if (action.type === 'move') {
    const newPlayers = players.map((player) => ({
      ...player,
      position: { x: player.position.x + 15, y: player.position.y },
    }));
    return newPlayers;
  }
};

function App() {
  const [players, gameDispatch] = useReducer(updateGame, initialState);
  console.log({ players });
  useInterval(() => {
    gameDispatch({ type: 'move' });
  }, 100);

  return (
    <div className="App">
      <Board players={players} />
    </div>
  );
}

export default App;
