    "use strict";
    var x,
        y,
        i,
        a,
        b,
        id,
        d = document,
		highlight,
        currentPath,
        div,
		whiteTurn,
        board = [],
        convertColor = ["w", "b"], //used to give white and black number values (handy for finding the right coordinates on pieces.png)
        convertType = [null, "P", "N", "B", "R", "Q", "K"], // same as above but for piece names (Pawn, kNight, Bishop, etc.)
        convertX = [0, "a", "b", "c", "d", "e", "f", "g", "h"];

    /*
    creates 8 arrays each containing 8 arrays that will be used to store and access piece location and color on the chess board
    also styles each div element of the chess board on the html page with the pieces.png sprite centred on a blank area
    */
    for (y = 1; y < 9; y += 1) {
        board[y] = [];
        for (x = 1; x < 9; x += 1) {
            board[y][x] = {"id": convertX[x] + y, "piece": 0};
            div = d.createElement("DIV");
            div.setAttribute("class", "square");
            d.getElementById(board[y][x].id).style.backgroundImage = "url('sprites/pieces.png')";
            d.getElementById(board[y][x].id).style.backgroundPosition = "0 -200";
        }
    } //uhhhh....
    function findPath(x, y) {
        var path = [],
            clear,
            moves,
            type,
            color,
            hasMoved;
        if (board[y] === undefined)
            console.log("Doesn't exist");
        else if (board[y][x] === undefined)
            console.log("Doesn't exist");
        else if (board[y][x].piece === 0)
            console.log("Nothing here");
        else {
            type = board[y][x].piece.type;
            color = board[y][x].piece.color,
            hasMoved = board[y][x].piece.moved;
			if (color === (whiteTurn ? "w" : "b")) {
				if (type === "B") {
					moves = [{x: 1, y: 1},
							 {x: 1, y: -1},
							 {x: -1, y: 1},
							 {x: -1, y: -1}];
					for (i = 0; i < moves.length; i += 1) {
						clear = true;
						a = x;
						b = y;
						while (clear === true) {
							a += (moves[i].x);
							b += (moves[i].y);
							if (board[b] === undefined)
								clear = false;
							else if (board[b][a] === undefined)
								clear = false;
							else if (board[b][a].piece === 0)
								path[path.length] = convertX[a] + b;
							else if (board[b][a].piece.color !== color) {
								path[path.length] = convertX[a] + b;
								clear = false;
							} else
								clear = false;
						}
					}
				} else if (type === "R") {
					moves = [{x: 0, y: 1},
							 {x: 0, y: -1},
							 {x: 1, y: 0},
							 {x: -1, y: 0}];
					for (i = 0; i < moves.length; i += 1) {
						clear = true;
						a = x;
						b = y;
						while (clear === true) {
							a += (moves[i].x);
							b += (moves[i].y);
							if (board[b] === undefined){
								clear = false;
							} else if (board[b][a] === undefined) {
								clear = false;
							} else if (board[b][a].piece === 0) {
								path[path.length] = convertX[a] + b;
							} else if (board[b][a].piece.color !== color) {
								path[path.length] = convertX[a] + b;
								clear = false;
							} else {
								clear = false;
							}
						}
					}
				} else if (type === "Q") {
					moves = [{x: 0, y: 1},
							 {x: 0, y: -1},
							 {x: 1, y: 0},
							 {x: -1, y: 0},
							 {x: 1, y: 1},
							 {x: 1, y: -1},
							 {x: -1, y: 1},
							 {x: -1, y: -1}];
					for (i = 0; i < moves.length; i += 1) {
						clear = true;
						a = x;
						b = y;
						while (clear === true) {
							a += (moves[i].x);
							b += (moves[i].y);
							if (board[b] === undefined){
								clear = false;
							} else if (board[b][a] === undefined) {
								clear = false;
							} else if (board[b][a].piece === 0) {
								path[path.length] = convertX[a] + b;
							} else if (board[b][a].piece.color !== color) {
								path[path.length] = convertX[a] + b;
								clear = false;
							} else {
								clear = false;
							}
						}
					}
				} else if (type === "N") {
					moves = [{x: 2, y: 1},
							 {x: 2, y: -1},
							 {x: -2, y: 1},
							 {x: -2, y: -1},
							 {x: 1,  y: 2},
							 {x: 1, y: -2},
							 {x: -1, y: 2},
							 {x: -1, y: -2}];
					for (i = 0; i < moves.length; i += 1) {
						a = x + (moves[i].x);
						b = y + (moves[i].y);
						
						if (board[b] === undefined) {
						} else if (board[b][a] === undefined) {
						} else if (board[b][a].piece === 0) {
							path[path.length] = convertX[a] + b;
						} else if (board[b][a].piece.color !== color) {
							path[path.length] = convertX[a] + b;
						}
					}
				} else if (type === "P") {
					a = (2 * convertColor.indexOf(color)) - 1;
					if (board[y] === undefined) {
					} else if (board[y][x + a] === undefined) {
					} else if (board[y][x + a].piece === 0) {
						path[path.length] = convertX[x + a] + y;
					}
					if (!hasMoved && board[y][x + 2 * a].piece === 0) {
						path[path.length] = convertX[x + 2 * a] + y;
					}
					if (board[y + 1] === undefined) {
					} else if (board[y + 1][x + a] === undefined) {
					} else if (board[y + 1][x + a].piece === 0) {
					} else if (board[y + 1][x + a].piece.color !== color) {
						path[path.length] = convertX[x + a] + (y + 1);
					}
					if (board[y - 1] === undefined) {
					} else if (board[y - 1][x + a] === undefined) {
					} else if (board[y - 1][x + a].piece === 0) {
					} else if (board[y - 1][x + a].piece.color !== color) {
						path[path.length] = convertX[x + a] + (y - 1);
					}
				} else if (type === "K") {
					moves = [{x: 0, y: 1},
							{x: 0, y: -1},
							{x: 1, y: 0},
							{x: -1, y: 0},
							{x: 1, y: 1},
							{x: 1, y: -1},
							{x: -1, y: 1},
							{x: -1, y: -1}];
					for (i = 0; i < moves.length; i += 1) {
						a = x + (moves[i].x);
						b = y + (moves[i].y);
						if (board[b][a] === undefined) {
						} else if (board[b][a].piece === 0) {
							path[path.length] = convertX[a] + b;
						} else if (board[b][a].piece.color !== color) {
							path[path.length] = convertX[a] + b;
						}
					}
				}
				console.log("Legal moves for " + color + type + " at "+ board[y][x].id + ":\n" + path);
				return path;
			} else { 
			console.log("The turn belongs to " + (whiteTurn ? "white" : "black"))
			}
		}
    }

    /*
    stores input data to corresponding board coordinates (board[y][x].piece = {color: color, type: type}),
    and finds the right location for it
    */
    function spawn(x, y, type, color, first) {
        var t = convertType.indexOf(type),
            c = convertColor.indexOf(color),
            bgY = Math.round(t / 2) * -50 + "px",
            bgX = ((((t) - 1) % 2) + ((c) * 2)) * -50 + "px",
            bg = bgX + " " + bgY;
        board[y][x].piece = {};
        board[y][x].piece.color = color;
        board[y][x].piece.type = type;
        if (first) {
            board[y][x].piece.moved = false;
        } else {
            board[y][x].piece.moved = true;
        }
        d.getElementById(board[y][x].id).style.backgroundPosition = bg;
        return;
    }

    function clear(x, y) {
        board[y][x].piece = 0;
        d.getElementById(board[y][x].id).style.backgroundPositionX = "-200";
		d.getElementById(board[y][x].id).style.backgroundPositionY = "0";
    }
	
	function clearVisualPath() {
		for (a = 0; a < 8; a += 1) {
			for (b = 0; b < 8; b += 1) {
                id = board[a + 1][b + 1].id;
                d.getElementById(id).style.backgroundColor = "";
            }
        }
	}
	
	function clicked(almostX, y) {
        var isPathSquare = false,
			x = convertX.indexOf(almostX),
            type,
            color;
		//check if the clicked square is a potential move
        if (currentPath) {
			for (i = 0; i < currentPath.length && !isPathSquare; i += 1) {
				isPathSquare = currentPath[i] === (almostX + y);
			}
			if (isPathSquare) {
				type = board[highlight.y][highlight.x].piece.type;
				color = board[highlight.y][highlight.x].piece.color;
				clear(highlight.x, highlight.y);
				spawn(x, y, type, color);
				whiteTurn = !whiteTurn;
			}
			clearVisualPath();
			currentPath = "";
        } else {
			highlight = {"x": x, "y": y};
            currentPath = findPath(x, y);
			if (currentPath) {
				for (i = 0; i < currentPath.length; i += 1) {
					d.getElementById(currentPath[i]).style.backgroundColor = "red";
				}
			}
		}
		return;
    }

    //could be a new program
    function newGame() {
		for (a = 1; a < 9; a += 1) {
			for (b = 1; b < 9; b += 1) {
				clear(a, b);
			}
		}
		whiteTurn = true;
        spawn(1, 1, "R", "b", 1);
        spawn(1, 8, "R", "b", 1);
        spawn(1, 2, "N", "b", 1);
        spawn(1, 7, "N", "b", 1);
        spawn(1, 3, "B", "b", 1);
        spawn(1, 6, "B", "b", 1);
        spawn(1, 4, "Q", "b", 1);
        spawn(1, 5, "K", "b", 1);
        spawn(8, 1, "R", "w", 1);
        spawn(8, 8, "R", "w", 1);
        spawn(8, 2, "N", "w", 1);
        spawn(8, 7, "N", "w", 1);
        spawn(8, 3, "B", "w", 1);
        spawn(8, 6, "B", "w", 1);
        spawn(8, 4, "Q", "w", 1);
        spawn(8, 5, "K", "w", 1);
        for (i = 1; i < 9; i += 1) {
            spawn(2, i, "P", "b", 1);
            spawn(7, i, "P", "w", 1);
        }
    }
	
	newGame();
