class GameUser {
  constructor(socket) {
    this.socket = socket;
    this.setEventListeners();
  }

  get id() {
    return this.socket.id;
  }

  get nsp() {
    return this.socket.nsp;
  }

  setEventListeners() {}
}

module.exports = { GameUser };
