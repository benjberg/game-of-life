import React, {useState, useCallback, useRef, useEffect} from 'react';
import produce from 'immer';
import {useForm} from 'react-hook-form';
import randomColor from 'randomcolor'; 
import '../src/style/app.scss';
import Rules from './Rules.js';






function App() {
  const [numRows,setNumRow] = useState(25);
  const rowsRef = useRef(numRows);
  rowsRef.current = numRows
  const [numCols, setNumCols] = useState(25);
  const colsRef = useRef(numCols);
  colsRef.current = numCols
  const [speed, setSpeed] = useState(750);
  const [color, setColor] = useState('red');
  const [deadColor,setDeadColor] = useState('white');
  const [gen, setGen] = useState(0);
  const genRef = useRef(gen)
  genRef.current = gen
  
  
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

 

  
  

  
  // set up our grid state
  const [grid, setGrid] = useState(() => {
    const rows = [];
  for (let i = 0; i < rowsRef.current; i++){
    rows.push(Array.from(Array(colsRef.current), () => 0))
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
    if (!runningRef.current) {
      return;
    }
// set grid to start
    setGrid(g => {
      //runs through every cell in g and returns return a new grid based on the first with immer so we can change states
      
      return produce(g, gridCopy => {
        // loop through our rows and cols this will help us check for neighbors
       
        
        for (let i = 0; i < rowsRef.current; i++) {
          for (let k = 0; k < colsRef.current; k++) {
            let neighbors = 0;
            // grabs our pre-defined operations and checks them agains the cell making sure that it's a) within bounds and b) if it has a neighbor
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < rowsRef.current && newK >= 0 && newK < colsRef.current) {
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
    setGen(genRef.current + 1)
    setTimeout(runSim, speed);
  }, [speed]);

  

  
  return (
    <>
    <h1>Conways Game of Life</h1>
    <div className='bdiv'>
     <Rules>Game Rules</Rules>
    </div>
    <div className='controls'>

    <div className='buttons'>
      {/*  button set game state stop/start*/}
    <button className='button' onClick={() => {
      setRunning(!running);
      if (!running) {
        runningRef.current = true;
        runSim();
      }
    }}>{running ? 'stop' : 'start'}</button>
    {/* Button for random colors */}
    <button className='button' onClick = {() =>{
      setColor(randomColor());
      setDeadColor(randomColor())
    }}>Random Colors</button>
    {/* button to clear the current board */}
    <button className='button' onClick = {() => {
      const rows = [];
      for (let i = 0; i < rowsRef.current; i++){
        rows.push(Array.from(Array(colsRef.current), () => 0))
      }
      setGen(0)
      return setGrid(rows)
    }}>Clear Board</button>
    {/* button for random selection */}
    <button className='button' onClick = {() =>{
      const rows = [];
      for (let i = 0; i < rowsRef.current; i++){
        rows.push(Array.from(Array(colsRef.current), () => Math.random() > .8 ? 1 : 0))
      }
      setGrid(rows)
    }}>Randomize</button>
    </div>
    <form className='form'>
      {/* input to change speed */}
      <label classname='label'>
          game speed in milliseconds:
          <input className='input' type="number" value={speed} onChange={e => setSpeed(e.target.value)}/>
      </label>
      {/* input to change living cell color */}
      <label className='label'>
          Live Cell Color:
          <input className='input' type="text" value={color} onChange={e => setColor(e.target.value)}/>
      </label>
      {/* input to change dead cell color */}
      <label className='label'>
          Dead Cell Color:
          <input className='input' type="text" value={deadColor} onChange={e => setDeadColor(e.target.value)}/>
      </label>
        
      <p>Generation: {gen}</p>
      
    </form>
    </div>
    {/* creates graph repeats xcol num set to 20px */}
   <div className='playboard' style={{display: 'grid', gridTemplateColumns: `repeat(${colsRef.current}, 20px)`}}> 
  {/* map through grid taking index of i and k to find location */}
     {grid.map((rows, i) => 
     rows.map((col, k) => <div key={`${i}-${k}`} 
     style={{
       width: 20, height: 20, backgroundColor: grid[i][k] ? color : deadColor, border: 'solid 1px black'}}
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
