import React, {useState, useCallback, useRef} from 'react';
import produce from 'immer';
import {useForm} from 'react-hook-form';

// defines play space dimentions 
const numRows = 25;
const numCols = 25;
// defines all possible neighbors 
const operations = [
  [0,1],
  [0,-1],
  [1,-1],
  [-1,1],
  [1,1],
  [-1,-1],
  [1,0],
  [-1,0]
]
const generateEmptyBoard = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++){
    rows.push(Array.from(Array(numCols), () => 0))
  }
  return rows
}
function App() {
  const {handleSubmit} = useForm();
  const onSubmit = data => console.log(data);
  
  // set up our grid state
  const [grid, setGrid] = useState(() => {
    return generateEmptyBoard()
  });
  // set game state 
  const [running, setRunning] = useState(false);
  // keeps track of running state so it can be refed without re-rendering for every change
  const runningRef = useRef(running);
  runningRef.current = running
  // we dont want this function to change and re-render so calling useCallback and passing an empty array makes for 1 render
  const runSim = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
// set grid to start
    setGrid(g => {
      //runs through every cell in g and returns return a new grid based on the first with immer so we can change states
      return produce(g, gridCopy => {
        // loop through our rows and cols this will help us check for neighbors
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            // grabs our pre-defined operations and checks them agains the cell making sure that it's a) within bounds and b) if it has a neighbor
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });
        // runs game rules if it has less then 2 neighbors or more then 3 then it dies
            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } 
         // if it's dead but has three neighbors it comes to life   
            else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSim, 750);
  }, []);

  
  return (
    <>
    {/*  button set game state stop/start*/}
    <button onClick={() => {
      setRunning(!running);
      if (!running) {
        runningRef.current = true;
        runSim();
      }
    }}>{running ? 'stop' : 'start'}</button>
    {/* button to clear the current board */}
    <button onClick = {() => {
      setGrid(generateEmptyBoard());
    }}>Clear Board</button>
    {/* button for random selection */}
    <button onClick = {() =>{
      const rows = [];
      for (let i = 0; i < numRows; i++){
        rows.push(Array.from(Array(numCols), () => Math.random() > .9 ? 1 : 0))
      }
      setGrid(rows)
    }}>Randomize</button>
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="number" placeholder="rows" name="rows"  />
      <input type="number" placeholder="cols" name="cols"  />

      <input type="submit" value='submit'/>
    </form>
    {/* creates graph repeats xcol num set to 20px */}
   <div style={{display: 'grid', gridTemplateColumns: `repeat(${numCols}, 20px)`}}> 
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
