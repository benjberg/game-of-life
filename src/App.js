import React, {useState, useCallback} from 'react';
import produce from 'immer';
require('dotenv');

// defines play space dementions 
const numRows = 50;
const numCols = 50;

function App() {
  // set up our grid
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++){
      rows.push(Array.from(Array(numCols), () => 0))
    }
    return rows
  });
  // set game state 
  const [running, setRunning] = useState(false);
  // keeps track of running state so it can be refed without re-rendering for every change
  const runningRef = useRef(running);
  runningRef.current = running
  // we dont want this function to change and re-render so calling useCallback and passing an empty array makes for 1 render
  const runSim = useCallback(() => {
    if (!running){
      return;
    }
    setTimeout(runSim, 1000)
  }, []) 
  return (
    <>
    {/* create button set game state */}
    <button onClick={() => {
      setRunning(!running)
    }}>{running ? 'stop' : 'start'}</button>
    {/* creates graph repeats xcol num set to 20px */}
   <div style={{display: 'grid', gridTemplateColumns: `repeat(${numCols}, 20px)` 
    
  }}> 
  {/* map through grid taking index of i and k to find location */}
     {grid.map((rows, i) => 
     rows.map((col, k) => <div key={`${i}-${k}`} 
     style={{
       width: 20, height: 20, backgroundColor: grid[i][k] ? 'red' : undefined, border: 'solid 1px black'}}
       onClick={ () => {
         // calls produce from immer and allows us to change and track state of grid/ takes state and gives us a copy to change, then takes changes and produces immutable state (next state)
        const newGrid = produce(grid, gridCopy => {
          gridCopy[i][k] = grid[i][k] ? 0 : 1;
         
        })
        setGrid(newGrid)
     }}
     />))}
   </div>
   </>
  );
}

export default App;
