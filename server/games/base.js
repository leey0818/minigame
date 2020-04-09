class BaseGameUser {
  constructor(socket) {
    this.socket = socket;
  }

  get id() {
    return this.socket.id;
  }

  get nsp() {
    return this.socket.nsp;
  }
}

module.exports = { BaseGameUser };
