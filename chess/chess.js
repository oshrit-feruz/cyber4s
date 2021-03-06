const BoardSize = 8;
let selectedCell;
let table;
let boardData = null
//get all moves for each player type
function getBishopMoves(row, col) {
  for (let i = 0; i < BoardSize; i++) {
    // back
    drawCellsMove(+row + i, +col + i);
    drawCellsMove(+row - i, +col - i);
    drawCellsMove(+row + i, +col - i);
    drawCellsMove(+row - i, +col + i);
  }
}
function getQueenMoves(row, col) {
  getRookMoves(row, col);
  getBishopMoves(row, col);
}
function getKingMoves(row, col) {
  drawCellsMove(+row + 1, +col);
  drawCellsMove(+row - 1, +col);
  drawCellsMove(+row + 1, +col + 1);
  drawCellsMove(+row + 1, +col - 1);

  drawCellsMove(+row, +col + 1);
  drawCellsMove(+row, +col - 1);
  drawCellsMove(+row - 1, +col - 1);
  drawCellsMove(+row - 1, +col + 1);
}
function getRookMoves(row, col) {
  for (let i = 0; i < 8; i++) {

    drawCellsMove(+row + i, +col);
    drawCellsMove(+row - i, +col);
    drawCellsMove(+row, +col + i);
    drawCellsMove(+row, +col - i);
  }
}
function getKnightMoves(row, col) {
  drawCellsMove(+row + 2, +col + 1);
  drawCellsMove(+row + 2, +col - 1);
  drawCellsMove(+row + 1, +col + 2);
  drawCellsMove(+row + 1, +col - 2);
  drawCellsMove(+row - 2, +col + 1);
  drawCellsMove(+row - 2, +col - 1);
  drawCellsMove(+row - 1, +col + 2);
  drawCellsMove(+row - 1, +col - 2);

}
class BoardData {
  constructor() {
    this.pieces = [];
    this.initPieces()

  }
  //loop that `run` on each player for remove him from their cell.
  removePiece(row, col) {
    for (let i = 0; i < this.pieces.length; i++) {
      let piece = this.pieces[i];
      if (piece.row === row && piece.col === col) {
        this.pieces.splice(i, 1);
      }
    }
  }
  //place the players on their places
  initPieces() {
    let index = 0
    for (let i = 0; i < 8; i++) {
      this.pieces.push(new Piece('white', this.checkPlace(i), 7, i, index))
      index++
      this.pieces.push(new Piece('black', this.checkPlace(i), 0, i, index))
      index++
      this.pieces.push(new Piece('white', 'pawn', 6, i, index))
      index++
      this.pieces.push(new Piece('black', 'pawn', 1, i, index))
      index++
    }
  }
  //function for `moving` the player- the loop `runs` on all of them
  movePiece(tarRow, tarCol, lastrow, lastcol) {
    for (let i = 0; i < this.pieces.length; i++) {
      const piece = this.pieces[i];
      if (piece.col === lastcol && piece.row === lastrow) {
        piece.row = tarRow;
        piece.col = tarCol;
      }
    }
  }

  //placed the player
  checkPlace(column) {
    const placeObj = {
      1: 'knight',
      6: 'knight',
      2: 'bishop',
      5: 'bishop',
      0: 'rook',
      7: 'rook',
      3: 'queen',
      4: 'king'
    };
    return placeObj[column]
  }
  getPiece(row, col) {
    let res = this.pieces.filter(cell => cell.row == row && cell.col == col)[0];
    return res
  }
}
class Piece {
  constructor(color, type, row, col, index) {
    this.color = color;
    this.type = type;
    this.col = col;
    this.row = row;
    this.index = index;
    this.initPiece();
  }

  initPiece() {
    this.image = document.createElement("img");
    this.image.src = `./chesselement/${this.color} ${this.type}.png`;
    this.image.setAttribute('type', this.type);
    this.image.setAttribute('color', this.color);
    let cell = table.rows[this.row].cells[this.col];
    cell.appendChild(this.image);
  }
  //`tag` the player by their moving opptions
  getPossibleMoves() {
    const funcObj = {
      pawn: 'pawnMove',
      rook: 'rookMove',
      knight: 'knightMove',
      bishop: 'bishopMove',
      king: 'kingMove',
      queen: 'queenMove'
    }

    this.possibleMoves = this[funcObj[this.type]]()
    return this.possibleMoves
  }

  pawnMove() {
    let rowPos = this.row
    let res = []
    if (this.color === 'black') {
      res.push({ row: this.row + 1, col: this.col })
    }
    else if (this.color === 'white') {
      res.push({ row: this.row - 1, col: this.col })
    }
    return res
  }

  rookMove() {

    let moves = []
    moves.push(...this.getMovesFromDirection(1, 0))
    moves.push(...this.getMovesFromDirection(-1, 0))
    moves.push(...this.getMovesFromDirection(0, -1))
    moves.push(...this.getMovesFromDirection(0, 1))
    return moves

  }
  knightMove() {
    let row = this.row
    let col = this.col
    let posArr = [
      {
        row: row + 2,
        col: col + 1
      },
      {
        row: row + 2,
        col: col - 1
      },
      {
        row: row - 2,
        col: col + 1
      },
      {
        row: row - 2,
        col: col - 1
      },
      {
        row: row + 1,
        col: col + 2
      },
      {
        row: row + 1,
        col: col - 2
      },
      {
        row: row - 1,
        col: col + 2
      },
      {
        row: row - 1,
        col: col - 2
      }
    ]

    posArr = posArr.filter(pos => {
      let isOccupied = boardData.getPiece(pos.row, pos.col)
      return this.isOnBoard(pos.row, pos.col) && (!isOccupied || isOccupied.color !== this.color)
    })
    return posArr

  }
  bishopMove() {

    let moves = []
    moves.push(...this.getMovesFromDirection(1, 1))
    moves.push(...this.getMovesFromDirection(1, -1))
    moves.push(...this.getMovesFromDirection(-1, -1))
    moves.push(...this.getMovesFromDirection(-1, 1))
    return moves
  }
  kingMove() {
    let row = this.row
    let col = this.col
    let posArr = [
      {
        row: row + 1,
        col: col + 1
      }, {
        row: row + 1,
        col: col
      }, {
        row: row + 1,
        col: col - 1
      }, {
        row: row - 1,
        col: col + 1
      }, {
        row: row - 1,
        col: col
      }, {
        row: row - 1,
        col: col - 1
      }, {
        row,
        col: col + 1
      }, {
        row,
        col: col - 1
      }
    ]

    posArr = posArr.filter(pos => {
      let isOccupied = boardData.getPiece(pos.row, pos.col)
      return this.isOnBoard(pos.row, pos.col) && (!isOccupied || isOccupied.color !== this.color)
    })
    return posArr
  }

  queenMove() {
    let moves = []
    moves.push(...this.bishopMove())
    moves.push(...this.rookMove())
    return moves

  }

  getMovesFromDirection(dirRow, dirCol) {
    let row = this.row
    let col = this.col

    let res = []
    for (let i = 1; i < 8; i++) {
      let c = col + i * dirCol
      let r = row + i * dirRow
      if (this.isOnBoard(r, c)) {
        let isOccupied = boardData.getPiece(r, c)
        if (!isOccupied || isOccupied.color !== this.color) {
          res.push({ row: r, col: c })
          if (isOccupied) {
            break
          }
        }
        else break
      }
      else break
    }

    return res

  }
  isOnBoard(row, col) {
    return row >= 0 && row <= 7 && col >= 0 && col <= 7
  }
}
//actually `connect` between the ID element and the possible moves folr css also
function drawCellsMove(row, col) {
  let cellsmove = document.getElementById(String(row + ` ` + col));
  if (cellsmove && cellsmove !== selectedCell) {
    cellsmove.classList.add('cellsmove')
  }
}
function removeAllMoves() {
  // console.log(document.querySelectorAll('table tr td.cellsmove'))
  document.querySelectorAll('table tr td.cellsmove').forEach((cell) => {
    cell.classList.remove('cellsmove');
  })
}
//the possible options that happend while you clicking on cells
function onCellClick(event) {
  console.log(selectedCell);
  let target = event.currentTarget
  console.log(target)
  if (selectedCell !== undefined) {
    selectedCell.classList.remove('selected');
  }
  if (event.currentTarget.classList.contains(`cellsmove`)) {
    console.log(`hfh`)
    target.innerHTML = selectedCell.innerHTML;
    selectedCell.innerHTML = " ";
    let position = (selectedCell.id);
    let lastrow = Number(position.split(' ')[0]);
    let lastcol = Number(position.split(' ')[1]);
    let tarRow = Number(event.currentTarget.id[0]);
    let tarCol = Number(event.currentTarget.id[2]);
    boardData.removePiece(tarRow, tarCol);
    boardData.movePiece(tarRow, tarCol, lastrow, lastcol);
    selectedCell.classList.remove('cellsmove');
  }
  if (event.currentTarget.tagName === "TD") {
    selectedCell = target;
  }
  removeAllMoves();
  selectedCell.classList.add('selected');
  let position = (selectedCell.id)
  let row = Number(position.split(' ')[0])
  let col = Number(position.split(' ')[1])
  let piece = boardData.getPiece(row, col)
  if (piece !== undefined) {
    let moves = piece.getPossibleMoves()
    moves.forEach(move => drawCellsMove(move.row, move.col))
  }
}
//place the white and the black players on their rows
function checkPieceWhite(column, cell) {
  const type = checkPlace(column)
  new Piece("white", type, [7, column], cell);
}
function checkPieceBlack(column, cell) {
  const type = checkPlace(column)
  new Piece("black", type, [0, column], cell);
}
table = document.createElement("table");
function createBoard() {
  for (let i = 0; i < BoardSize; i++) {
    const row = table.insertRow();
    for (let j = 0; j < BoardSize; j++) {
      const cell = row.insertCell();
      cell.id = i.toString() + " " + j.toString();
      if ((i + j) % 2 == 0) {

        cell.classList.add("dark-cell")
      } else {
        cell.className = 'light-cell';
      }

      cell.addEventListener('click', () => console.log(cell.id));
      cell.addEventListener('click', onCellClick);

    }
  }
  boardData = new BoardData()
}

document.body.appendChild(table);
table.className = "table1"
createBoard();
