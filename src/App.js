import React, { useReducer, useEffect, Fragment } from 'react';
import './App.css';
import Board from 'components/Board';
import {
  PLAYER_ONE,
  PLAYER_TWO,
  BOARD_SIZE,
  UNIT,
  GAME_ENDED,
  GAME_PLAYING,
  GAME_READY,
} from 'config/const';
import useInterval from 'hooks/useInterval';
import sumCoordinates from 'utils/sumCoordinates';
import playerCanChangeToDirection from 'utils/playerCanChangeToDirection';
import getCellKey from 'utils/getCellKey';
import getPlayableCells from 'utils/getPlayableCells';
import Start from 'components/Start';
import Result from 'components/Result';

const players = [PLAYER_ONE, PLAYER_TWO];

const initialState = {
  players,
  playableCells: getPlayableCells(
    BOARD_SIZE,
    UNIT,
    players.map((player) => getCellKey(player.position.x, player.position.y))
  ),
  gameStatus: GAME_READY,
};

const updateGame = (game, action) => {
  if (action.type === 'restart') {
    return {
      ...initialState,
      gameStatus: GAME_READY,
    };
  }
  if (action.type === 'start') {
    return {
      ...initialState,
      gameStatus: GAME_PLAYING,
    };
  }
  if (action.type === 'move') {
    const newPlayers = game.players.map((player) => ({
      ...player,
      position: sumCoordinates(player.position, player.direction),
    }));

    const newPlayersWithCollision = newPlayers.map((player) => {
      const myCellKey = getCellKey(player.position.x, player.position.y);
      return {
        ...player,
        hasDied:
          !game.playableCells.includes(myCellKey) ||
          newPlayers
            .filter((p) => p.id !== player.id)
            .map((p) => getCellKey(p.position.x, p.position.y))
            .includes(myCellKey),
      };
    });

    const newOcupiedCells = game.players.map((player) =>
      getCellKey(player.position.x, player.position.y)
    );

    const playableCells = game.playableCells.filter((playableCell) => {
      return !newOcupiedCells.includes(playableCell);
    });

    return {
      players: newPlayersWithCollision,
      playableCells: playableCells,
      gameStatus:
        newPlayersWithCollision.filter((player) => player.hasDied).length === 0
          ? GAME_PLAYING
          : GAME_ENDED,
    };
  }
  if (action.type === 'changeDirection') {
    const newPlayers = game.players.map((player) => ({
      ...player,
      direction:
        player.keys[action.key] &&
        playerCanChangeToDirection(player.direction, player.keys[action.key])
          ? player.keys[action.key]
          : player.direction,
    }));
    return {
      players: newPlayers,
      playableCells: game.playableCells,
      gameStatus: game.gameStatus,
    };
  }
};

function App() {
  let result = null;

  const [game, gameDispatch] = useReducer(updateGame, initialState);

  const diedPlayers = game.players.filter((p) => p.hasDied);
  if (diedPlayers.length > 0) {
    console.log({ diedPlayers });
  }

  useInterval(
    () => {
      gameDispatch({ type: 'move' });
    },
    game.gameStatus !== GAME_PLAYING ? null : 100
  );

  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = `${event.keyCode}`;
      console.log({ key });
      if (key === '13') {
        if (game.gameStatus === GAME_READY) {
          handleStart();
        }
        if (game.gameStatus === GAME_ENDED) {
          handleRestart();
        }
      }
      gameDispatch({ type: 'changeDirection', key });
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [game.gameStatus]);

  const handleStart = () => {
    gameDispatch({ type: 'start' });
  };

  const handleRestart = () => {
    gameDispatch({ type: 'restart' });
  };

  if (game.gameStatus === GAME_ENDED) {
    const winningPlayer = game.players.filter((player) => !player.hasDied);
    if (winningPlayer.length === 0) {
      result = 'Empate';
    } else {
      result = `Ganador: ${winningPlayer.map((player) => `Jugador ${player.id}`).join(',')}`;
    }
  }

  return (
    <Fragment>
      <Board players={game.players} gameStatus={game.gameStatus} />
      {game.gameStatus === GAME_ENDED && <Result onClick={handleRestart} result={result} />}
      {game.gameStatus === GAME_READY && <Start onClick={handleStart} />}
    </Fragment>
  );
}

export default App;
