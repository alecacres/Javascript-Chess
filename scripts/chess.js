"use strict"
let id;
let highlight;
let currentPath;
let div;
let whiteTurn;
let whiteCheck;
let blackCheck;
let standardBoard = [];
let pieces = [];
let enPassant = {x: undefined, y: undefined, color: undefined};

const d = document;
const WHITE = "w";
const BLACK = "b";
const QUEEN = "Q";
const KING = "K";
const BISHOP = "B";
const KNIGHT = "N";
const ROOK = "R";
const PAWN = "P";
const convertColor = [WHITE, BLACK]; //used to give white and black number values (handy for finding the right coordinates on "pieces.png")
const convertType = [null, PAWN, KNIGHT, BISHOP, ROOK, QUEEN, KING]; // same as above but for piece names (Pawn; kNight; Bishop; etc.)
const convertY = [0, "a", "b", "c", "d", "e", "f", "g", "h"];
const MOVE_DATA = {
    "K": [{y: 0, x: 1},
       {y: 0, x: -1},
       {y: 1, x: 0},
       {y: -1, x: 0},
       {y: 1, x: 1},
       {y: 1, x: -1},
       {y: -1, x: 1},
       {y: -1, x: -1}],

    "Q": [{y: 0, x: 1},
        {y: 0, x: -1},
        {y: 1, x: 0},
        {y: -1, x: 0},
        {y: 1, x: 1},
        {y: 1, x: -1},
        {y: -1, x: 1},
        {y: -1, x: -1}],

    "B": [{y: 1, x: 1},
        {y: 1, x: -1},
        {y: -1, x: 1},
        {y: -1, x: -1}],

    "N": [{y: 2, x: 1},
        {y: 2, x: -1},
        {y: -2, x: 1},
        {y: -2, x: -1},
        {y: 1,  x: 2},
        {y: 1, x: -2},
        {y: -1, x: 2},
        {y: -1, x: -2}],

    "R": [{y: 0, x: 1},
        {y: 0, x: -1},
        {y: 1, x: 0},
        {y: -1, x: 0}]
};
const BEHAVIOR = {
    "K": KING,
    "Q": "repeats",
    "R": "repeats",
    "B": "repeats",
    "N": KNIGHT,
    "P": PAWN
};

/*
creates 8 arrays each containing 8 arrays that will be used to store and access piece location and color on the chess standardBoard
also styles each div element of the chess standardBoard on the html page with the "pieces.png" sprite centred on a blank area
*/
for (let a = 0; a < 9; a += 1) {
    standardBoard[a] = [];
}

for (let x = 1; x < 9; x += 1) {
    for (let y = 1; y < 9; y += 1) {
        standardBoard[x][y] = {"id": convertY[y] + x, "piece": 0};
        div = d.createElement("DIV");
        div.setAttribute("class", "square");
        d.getElementById(standardBoard[x][y].id).style.backgroundImage = "url('../sprites/pieces.png')";
        d.getElementById(standardBoard[x][y].id).style.backgroundPosition = "0 -200";
    }
}

function switchColor(color) {
    return (color === WHITE) ? BLACK : ((color === BLACK) ? WHITE : -1);
}

function coordinates(x, y) {
    if (typeof y === "number") {
        y = convertY[y];
    }
    return {"x": x, "y": y};
}

function copyBoard(board) {
    let testBoard = [];
    for (let a = 0; a < board.length; a += 1) {
        testBoard.push([]);
        if (a !== 0) {
            for (let b = 1; b < board[a].length; b += 1) {
                testBoard[a][b] = {};
                testBoard[a][b].id = board[a][b].id;
                testBoard[a][b].piece = board[a][b].piece;
            }
        }
    }

    return testBoard;
}

//returns the legal path for a given piece on a given board
function findPath(x, y, board, logMoves) {
    let legalPath;
    let value;
    let color;
    let moves;
    let behavior;
    if (board[x] === undefined) {
        console.log("Doesn't exist");
    } else if (board[x][y] === undefined) {
        console.log("Doesn't exist");
    } else if (board[x][y].piece === 0) {
        console.log("No piece at x: " + x + ", y: " + y);
    } else {
        // console.log("X: " + x + ", Y: " + y + ", Board: " + board);
        value = board[x][y].piece.value;
        color = board[x][y].piece.color;
        moves = MOVE_DATA[value];
        behavior = BEHAVIOR[value];
        legalPath = getLegalMoves(x, y, board, moves, color, behavior);
        if (logMoves) console.log("Legal moves for " + color + value + " at " + board[x][y].id + ":\n" + legalPath);
		return legalPath;
	}
}



function getLegalMoves(x, y, board, moves, color, behavior) {
    let legalPath = [];
    let hasMoved = board[x][y].piece.moved;
    let a;
    if(behavior === PAWN) {
        a = (2 * convertColor.indexOf(color)) - 1;
        if (board[x] !== undefined && board[x][y + a] !== undefined && board[x][y + a].piece === 0) {
            legalPath.push(coordinates(x, y + a));
        }
        if (!hasMoved && board[x] !== undefined && board[x][y + a] !== undefined && board[x][y + 1 * a].piece === 0 && board[x][y + 2 * a].piece === 0) {
            legalPath.push(coordinates(x, y + 2 * a));
        }
        if (board[x + 1] !== undefined && board[x + 1][y + a] !== undefined && (board[x + 1][y + a].piece !== 0 && board[x + 1][y + a].piece.color !== color) || (enPassant.x === x + 1 && enPassant.y === y + a && enPassant.color !== color)) {
            legalPath.push(coordinates(x + 1, y + a));
        }
        if (board[x - 1] !== undefined && board[x - 1][y + a] !== undefined && (board[x - 1][y + a].piece !== 0 && board[x - 1][y + a].piece.color !== color) || (enPassant.x === x - 1 && enPassant.y === y + a && enPassant.color !== color)) {
            legalPath.push(coordinates(x - 1, y + a));
        }
    } else {
        for (let i = 0; i < moves.length; i += 1) {
            let unobstructed = true;
            let a = x;
            let b = y;
            if (behavior === "repeats") {
                while (unobstructed) {
                    a += moves[i].x;
                    b += moves[i].y;
                    /** store "empty board path" to board **/
                    if (board[a] !== undefined && board[a][b] !== undefined && board[a][b].piece === 0) {
                        legalPath.push(coordinates(a, b));
                    } else if (board[a] !== undefined && board[a][b] !== undefined && board[a][b].piece.color !== color) {
                        legalPath.push(coordinates(a, b));
                        unobstructed = false;
                    } else {
                        unobstructed = false;
                    }
                } 
            } else if (behavior === KING || KNIGHT) {
                a += moves[i].x;
                b += moves[i].y;
                if (board[a] !== undefined && board[a][b] !== undefined && (board[a][b].piece === 0 || board[a][b].piece.color !== color)) {
                    legalPath.push(coordinates(a, b));
                }
            }
        }
        if (behavior === KING && !board[x][y].piece.moved) {
            
        }
    }
    return legalPath;
}

/*
stores input data to corresponding board coordinates (board[x][y].piece = {color: color; value: value}),
and finds the right location for it
*/
function spawn(x, y, board, value, color, identifier) {
    let t = convertType.indexOf(value);
    let c = convertColor.indexOf(color);
    let bgY = Math.round(t / 2) * -50 + "px";
    let bgX = ((((t) - 1) % 2) + ((c) * 2)) * -50 + "px";
    let bg = bgX + " " + bgY;
    board[x][y].piece = {};
    board[x][y].piece.color = color;
    board[x][y].piece.value = value;
    if (identifier === undefined) {
        board[x][y].piece.moved = false;
        pieces.push({"x": x, "y": y, "value": value, "color": color, "moved": false});
        board[x][y].piece.identifier = pieces.length - 1;
    } else {
        board[x][y].piece.identifier = identifier;
        board[x][y].piece.moved = true;
        pieces[board[x][y].piece.identifier].moved = true;
        pieces[board[x][y].piece.identifier].x = x;
        pieces[board[x][y].piece.identifier].y = y;
    }
    d.getElementById(board[x][y].id).style.backgroundPosition = bg;
}

function clear(x, y, board) {
    board[x][y].piece = 0;
    d.getElementById(board[x][y].id).style.backgroundPositionX = "-200";
	d.getElementById(board[x][y].id).style.backgroundPositionY = "0";
}

function clearHighlight() {
	for (let a = 0; a < 8; a += 1) {
		for (let b = 0; b < 8; b += 1) {
            id = standardBoard[a + 1][b + 1].id;
            d.getElementById(id).style.backgroundColor = "";
        }
    }
}

function clicked(convertedY, x) {
    let isPathSquare = false;
    let y = convertY.indexOf(convertedY);
    let value;
    let color;
    let a;
    let identifier;
    let king;
	//check if the clicked square is a potential move
    if (currentPath) {
        for (let i = 0; i < currentPath.length && !isPathSquare; i += 1) {
            isPathSquare = (convertedY + x) === currentPath[i].y + currentPath[i].x;
		}
		if (isPathSquare) {
            value = standardBoard[highlight.x][highlight.y].piece.value;
			color = standardBoard[highlight.x][highlight.y].piece.color;
            identifier = standardBoard[highlight.x][highlight.y].piece.identifier;
            a = (2 * convertColor.indexOf(color)) - 1;
            king = pieces.filter(piece => {
                return piece.value === KING && piece.color !== color;
            })[0];
			clear(highlight.x, highlight.y, standardBoard);
            if (x === enPassant.x && y === enPassant.y) {
                clear(x, y - a, standardBoard);
            }
            enPassant.x = undefined;
            enPassant.y = undefined;
            //If this move puts a pawn at one of edges, offer a promotion
            if (value === PAWN && (y === 8 || y === 1)) {
                //*_ offer selection of pieces
                value = QUEEN;
            }
            if (value === PAWN && (highlight.y === 2 || highlight.y === 7) && (y === 4 || y === 5)) {
                enPassant.x = highlight.x;
                enPassant.y = highlight.y + a;
                enPassant.color = color;
            }
        	spawn(x, y, standardBoard, value, color, identifier);
		whiteTurn = !whiteTurn;
		clearHighlight();
		currentPath = "";
    } else {
        color = standardBoard[x][y].piece.color;
        if (color === (whiteTurn ? WHITE : BLACK)) {
    		highlight = {"x": x, "y": y};
            currentPath = findPath(x, y, standardBoard, true);
    		if (currentPath) {
                for (let i = 0; i < currentPath.length; i += 1) {
                    d.getElementById(currentPath[i].y + currentPath[i].x).style.backgroundColor = "white";
                }
            }

        } else if (standardBoard[x][y].piece !== 0) {
            console.log("The turn belongs to " + (whiteTurn ? "white" : "black"));
        } else {
            console.log("There's nothing here");
        }
    }
	return;
}

function newBoard(board) {
    let testBoard = [];
    for (let i = 1; i < (board.length - 1); i += 1) {
        testBoard.push([]);
        for (let j = 1; j < (board[i].length - 1); j += 1) {
            testBoard[i][j] = board[i][j];
        }
    }
    return testBoard;
}

//could be a new program
function newGame() {
	for (let a = 1; a < 9; a += 1) {
		for (let b = 1; b < 9; b += 1) {
            clear(a, b, standardBoard);
		}
	}
	whiteTurn = true;
    whiteCheck = false;
    blackCheck = false;
    spawn(1, 1, standardBoard, ROOK, BLACK);
    spawn(8, 1, standardBoard, ROOK, BLACK);
    spawn(2, 1, standardBoard, KNIGHT, BLACK);
    spawn(7, 1, standardBoard, KNIGHT, BLACK);
    spawn(3, 1, standardBoard, BISHOP, BLACK);
    spawn(6, 1, standardBoard, BISHOP, BLACK);
    spawn(4, 1, standardBoard, QUEEN, BLACK);
    spawn(5, 1, standardBoard, KING, BLACK);
    spawn(1, 8, standardBoard, ROOK, WHITE);
    spawn(8, 8, standardBoard, ROOK, WHITE);
    spawn(2, 8, standardBoard, KNIGHT, WHITE);
    spawn(7, 8, standardBoard, KNIGHT, WHITE); 
    spawn(3, 8, standardBoard, BISHOP, WHITE);
    spawn(6, 8, standardBoard, BISHOP, WHITE);
    spawn(4, 8, standardBoard, QUEEN, WHITE);
    spawn(5, 8, standardBoard, KING, WHITE);
    for (let i = 1; i < 9; i += 1) {
        spawn(i, 2, standardBoard, PAWN, BLACK);
        spawn(i, 7, standardBoard, PAWN, WHITE);
    }
}

newGame();
