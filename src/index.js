import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
    return(
        <button className="square" onClick={props.onClick}  key={props.key}>
          {props.value? 'X': 'O'}
        </button>
      );
    }
  
  
  class Board extends React.Component {

    renderSquare(i) {
        return (
        <Square 
                value={this.props.squares[i]} 
                onClick={() => this.props.onClick(i)}
                key={i}
                />
        );
    }
    
    rowcells(rowstartpos, rowlength){
      
      var cells = [];
      for (var i = 0; i < rowlength; i++) {
          // note: we add a key prop here to allow react to uniquely identify each
          // element in this array. see: https://reactjs.org/docs/lists-and-keys.html
          cells.push(
            this.renderSquare(rowstartpos*rowlength +i));
      }
      return cells;
    }

    rows( rowlength, nrOfRows){
      var cells = [];
      for (var i = 0; i < 10; i++) {
          // note: we add a key prop here to allow react to uniquely identify each
          // element in this array. see: https://reactjs.org/docs/lists-and-keys.html
          cells.push(
            <div className="board-row" key={i}>
              {this.rowcells(i,rowlength)}
            </div>
          )
      }
      return cells;
    }
  
    render() {
      
      return (
        
        <div>
         Size: ({this.props.nrOfRows},{this.props.rowlength})
          {this.rows(this.props.rowlength, this.props.nrOfRows)}
        </div>
      );
    }
  }
  
  class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          history: [{
            squares: Array(20*10).fill(null),
            movelocation:0,
          }], 
          rowlength :20,
          nrOfRows:10,          
          stepNumber: 0,
          xIsNext: true,
                 
        };
      }

      handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
      //  if (calculateWinner(squares) || squares[i]) {
       //   return;
       // }

        //
        squares[i] = !squares[i]
       var neighboursNrI = GetNeighboursNrI(i,squares, this.state.rowlength, this.state.nrOfRows);
       console.debug('neigbours of '+i+' : '+ neighboursNrI)
        var ml =  i;
        this.setState({
            history: history.concat([{
                squares: squares,
                movelocation: ml,
              }]),
              
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
      }

      jumpTo(step) {
        this.setState({
          stepNumber: step,
          xIsNext: (step % 2) === 0,
        });
      }   

      nextTurn() {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        var nbSquares =calculateNeigbours(squares);
        var liveCells = calculateLiveCells(nbSquares);
        //set livecells
        var ml =  42;
        this.setState({
            history: history.concat([{
                squares: liveCells,
                movelocation: ml,
              }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
      }
    
    
      render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        
        const moves = history.map((step, move) => {
            const desc = move ?
              'Go to move #' + move +' movloc: (' 
              + Math.floor(step.movelocation/ this.state.nrOfRows )+ ','+ step.movelocation % this.state.rowlength  + ')'  :
              'Go to game start';
            return (
              <li key={move} >
                <button className={move===this.state.stepNumber?'curmove':''} 
                        onClick={() => this.jumpTo(move)}>{desc}</button>
              </li>
            );
          });

     
        let status;
        if (winner) {
          status = 'Winner: ' + winner;
        } else {
          status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

      return (
        <div className="game">
          <div className="game-board">
          <Board
            rowlength={this.state.rowlength}
            nrOfRows={this.state.nrOfRows}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
          </div>

          <div className="game-info">
          <div>
            <button onClick={() => this.nextTurn()}>next Turn</button>
             </div>
            <div>{ status }</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }

  function GetNeighboursNrI(currenti ,squares, rowlength, nrOfRows){
    var neigPositions = [-1-rowlength, 0-rowlength, 1-rowlength
      -1, 1,
    rowlength-1, rowlength, rowlength+1];
    var nb = 0;
    for(let i=0 ; i < neigPositions.length ; i++){
      if(squares[currenti][neigPositions[i]]){
        nb++;
      }
    }
    return nb;
  }

  function calculateNeigbours( cellSquares){
    return cellSquares;
  }

  function calculateLiveCells( cellSquares){
    return cellSquares;
  }
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  