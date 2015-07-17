(function chess() {
    "use strict";
    var x,
        y,
        i,
        d = document,
        convertColor = ["w", "b"], //used to give white and black number values (handy for finding the right coordinates on pieces.png)
        convertType = [null, "P", "N", "B", "R", "Q", "K"], // same as above but for piece names (Pawn, kNight, Bishop, etc.)
        /**
        Creates 8 arrays each containing 8 arrays with the value "false" -- Later used to create variables to store legal path data for pieces
        **/
        Plane = (function () {
            var a = [],
                b,
                c;
            for (b = 1; b < 9; b += 1) {
                a[b] = [];
                for (c = 1; c < 9; c += 1) {
                    a[b][c] = false;
                }
            }
            return a;
        }()),
        board = [];

    //x and y correspond to a square of the chessboard, converts to the id for its div element on the html page
    function id(x, y) {
        var a = [0, "a", "b", "c", "d", "e", "f", "g", "h"];
        return a[x] + y;
    }

    //creates 8 arrays each containing 8 arrays that will be used to store and access piece location and color on the chess board
    //also styles each div element of the chess board on the html page with the pieces.png sprite and centres it on a blank area
    for (y = 1; y < 9; y += 1) {
        board[y] = [];
        for (x = 1; x < 9; x += 1) {
            board[y][x] = null;
            d.getElementById(id(x, y)).style.backgroundImage = "url('sprites/pieces.png')";
            d.getElementById(id(x, y)).style.backgroundPosition = "0 -200";
        }
    }

    //uhhhh....
    function findPath(x, y) {
        if (board[y][x] === null) {
            return null;
        } else {
            var type = board[y][x].type,
                color = board[y][x].color;
            var bishop = function () {
        var moves = [{
                    x: 1,
                    y: 1
                            }, {
                    x: 1,
                    y: -1
                            },
                {
                    x: -1,
                    y: 1
                            }, {
                    x: -1,
                    y: -1
                            }],
            path = new Plane(),
            a,
            b,
            clear;
        for (i = 0; i < moves.length; i += 1) {
            clear = true;
            a = x;
            b = y;
            while (clear === true) {
                a += (moves[i].x);
                b += (moves[i].y);
                if (board[b][a] === undefined) {
                    clear = false;
                } else if (board[b][a] === null) {
                    path[b][a] = true;
                } else if (board[b][a].color !== color) {
                    path[b][a] = true;
                    clear = false;
                } else {
                    clear = false;
                }
            }
        }

                },

                rook = function () {
                    var moves = [{
                                x: 0,
                                y: 1
                            }, {
                                x: 0,
                                y: -1
                            },
                            {
                                x: 1,
                                y: 0
                            }, {
                                x: -1,
                                y: 0
                            }],
                        path = new Plane(),
                        a,
                        b,
                        clear;
                    for (i = 0; i < moves.length; i += 1) {
                        clear = true;
                        a = x;
                        b = y;
                        while (clear === true) {
                            a += (moves[i].x);
                            b += (moves[i].y);
                            if (board[y][x] === undefined) {
                                clear = false;
                            } else if (board[b][a] === null) {
                                path[b][a] = true;
                            } else if (board[b][a].color !== color) {
                                path[b][a] = true;
                                clear = false;
                            } else {
                                clear = false;
                            }
                        }
                    }
                },

                queen = function () {
                    var moves = [{
                                x: 0,
                                y: 1
                            }, {
                                x: 0,
                                y: -1
                            },
                            {
                                x: 1,
                                y: 0
                            }, {
                                x: -1,
                                y: 0
                            },
                            {
                                x: 1,
                                y: 1
                            }, {
                                x: 1,
                                y: -1
                            },
                            {
                                x: -1,
                                y: 1
                            }, {
                                x: -1,
                                y: -1
                            }],
                        path = new Plane(),
                        a,
                        b,
                        clear;
                    for (i = 0; i < moves.length; i += 1) {
                        clear = true;
                        a = x;
                        b = y;
                        while (clear === true) {
                            a += (moves[i].x);
                            b += (moves[i].y);
                            if (board[b][a] === undefined) {
                                clear = false;
                            } else if (board[b][a] === null) {
                                path[b][a] = true;
                            } else if (board[b][a].color !== color) {
                                path[b][a] = true;
                                clear = false;
                            } else {
                                clear = false;
                            }
                        }
                    }
                },

                knight = function () {
                    var moves = [{
                                x: 2,
                                y: 1
                            }, {
                                x: 2,
                                y: -1
                            },
                            {
                                x: -2,
                                y: 1
                            }, {
                                x: -2,
                                y: -1
                            },
                            {
                                x: 1,
                                y: 2
                            }, {
                                x: 1,
                                y: -2
                            },
                            {
                                x: -1,
                                y: 2
                            }, {
                                x: -1,
                                y: -2
                            }],
                        path = new Plane(),
                        a,
                        b;
                    for (i = 0; i < moves.length; i += 1) {
                        a = x + (moves[i].x);
                        b = y + (moves[i].y);
                        if (board[b][a] === undefined) {
                            return;
                        } else if (board[b][a] === null) {
                            path[b][a] = true;
                        } else if (board[b][a].color !== color) {
                            path[b][a] = true;
                        }
                    }
                },

                pawn = function () {
                    var path = new Plane(),
                        b = y + 1;
                    if (board[b][x] === undefined) {
                        return;
                    } else if (board[b][x] === null) {
                        path[b][x] = true;
                    }
                    if (board[b][x + 1] === undefined) {
                        return;
                    } else if (board[b][x + 1].color !== color) {
                        path[b][x + 1] = true;
                    }
                    if (board[b][x - 1] === undefined) {
                        return;
                    } else if (board[b][x - 1].color !== color) {
                        path[b][x - 1] = true;
                    }
                },

                king = function () {
                    var moves = [{
                                x: 0,
                                y: 1
                            }, {
                                x: 0,
                                y: -1
                            },
                            {
                                x: 1,
                                y: 0
                            }, {
                                x: -1,
                                y: 0
                            },
                            {
                                x: 1,
                                y: 1
                            }, {
                                x: 1,
                                y: -1
                            },
                            {
                                x: -1,
                                y: 1
                            }, {
                                x: -1,
                                y: -1
                            }],
                        path = new Plane(),
                        a,
                        b;
                    for (i = 0; i < moves.length; i += 1) {
                        a += (moves[i].x);
                        b += (moves[i].y);
                        if (board[b][a] === undefined) {
                            return;
                        } else if (board[b][a] === null) {
                            path[b][a] = true;
                        } else if (board[b][a].color !== color) {
                            path[b][a] = true;
                        }
                    }
                };
        }
    }

    //stores input data to corresponding board coordinates (board[y][x] = {color: color, type: type}), and finds the right location for 
    function spawn(x, y, type, color) {
        var t = convertType.indexOf(type),
            c = convertColor.indexOf(color),
            bgY = Math.round(t / 2) * -50 + "px",
            bgX = (((t - 1) % 2) + ((c - 1) * 2)) * -50 + "px",
            bg = bgX + " " + bgY;
        board[y][x] = {};
        board[y][x].color = color;
        board[y][x].type = type;
        d.getElementById(id(x, y)).style.backgroundPosition = bg;
        return;
    }

    function clear(x, y) {
        board[y][x] = null;
        d.getElementById(id(x, y)).style.backgroundPosition = "0 -200";
    }



    //could be a new program
    (function startingPositions() {
        spawn(1, 1, "R", "w");
        spawn(1, 8, "R", "w");
        spawn(1, 2, "N", "w");
        spawn(1, 7, "N", "w");
        spawn(1, 3, "B", "w");
        spawn(1, 6, "B", "w");
        spawn(1, 4, "Q", "w");
        spawn(1, 5, "K", "w");
        spawn(8, 1, "R", "b");
        spawn(8, 8, "R", "b");
        spawn(8, 2, "N", "b");
        spawn(8, 7, "N", "b");
        spawn(8, 3, "B", "b");
        spawn(8, 6, "B", "b");
        spawn(8, 4, "Q", "b");
        spawn(8, 5, "K", "b");
        for (i = 1; i < 9; i += 1) {
            spawn(2, i, "P", "w");
            spawn(7, i, "P", "b");
        }
    }());
}());
