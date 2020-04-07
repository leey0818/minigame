const io = require('socket.io')();
const port = 3000;
const options = {};

// Bingo 게임
io.of('/bingo').on('connection', require('./games/bingo'));

// TicTakToe 게임
io.of('/tictaktoe').on('connection', require('./games/tictaktoe'));

// listen port
console.log(`listening port ${port}`);
io.listen(port, options);
