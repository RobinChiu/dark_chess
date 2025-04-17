import './App.css';
import ChessBoard from './ChessBoard';

function App() {
const resetGame = () => {
  window.location.reload();
};

  return (
    <div className="App">
      <header className="App-header">
        <h1>Dark Chess Game</h1>
      </header>
      <ChessBoard />
      <button onClick={resetGame}>Reset Game</button>
    </div>
  );
}

export default App;
