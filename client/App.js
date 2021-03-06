import React from 'react';
import { v4 as uuid } from 'uuid';
import { ThemeProvider, DEFAULT_THEME } from '@zendeskgarden/react-theming';
import ChatPanel from './ChatPanel';
import Taboo from './Taboo';
import TeamDisplay from './TeamDisplay';
import AppHeader from './AppHeader';
import TurnDisplay from './TurnDisplay';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      usernames: {},
      gameState: {},
      timerActive: false
    };
  }

  componentDidMount() {
    if (!this.props.roomName) { return; }

    window.socket.on('chat message', (msg, color) => {
      this.setState({ messages: [...this.state.messages, { message: msg, color }] });
    });

    window.socket.on('usernames', (msg) => {
      this.setState({ usernames: msg });
    });

    window.socket.on('game state update', (gameState) => {
      console.log('got update', gameState);
      this.setState({ gameState });
    });
  }

  // request a new copy of the state from the server. called after the
  // component loads
  syncState() {
    window.socket.emit('sync');
  }

  endTurn(player) {
    console.log('ending turn', player);
    window.socket.emit('endTurn');
  }

  nextCard(player) {
    console.log('changing card', player);
    window.socket.emit('nextCard');
  }

  scoreCard(player) {
    console.log('scoring card', player);
    window.socket.emit('scoreCard');
  }

  failCard(player) {
    console.log('failed card', player);
    window.socket.emit('failCard');
  }

  startTimer(player) {
    console.log('starting timer', player);
    window.socket.emit('startTimer', new Date().getTime());
    this.setState({ timerActive: true })
  }

  clearTimer(player) {
    console.log('clearing timer', player);
    window.socket.emit('clearTimer');
    this.setState({ timerActive: false })
  }

  chooseLeader(player) {
    console.log('choosing leader', player);
    window.socket.emit('chooseLeader', player);
  }

  changeTeam(player) {
    console.log('changing teams', player);
    window.socket.emit('changeTeam', player);
  }

  render() {
    const { roomName, socketId } = this.props;
    const {
      messages, gameState, currentCard,
    } = this.state;
    const id = uuid();

    if (!roomName) {
      // TODO: extract to landing page component
      return (
        <div>
          <h1>Welcome!</h1>

          <p>To invite others to your game, just share the URL of your game with them</p>
          <a href={`?new#${id}`}>Start a random game</a>
        </div>
      );
    }
    console.log(gameState);

    return (
      <ThemeProvider theme={{ ...DEFAULT_THEME }}>
        <AppHeader gameState={gameState} socketId={socketId} roomName={roomName} usernames={this.state.usernames} changeTeam={this.changeTeam.bind(this)} />
        <div className='content'>
          <Taboo gameState={gameState} />
          <TurnDisplay timerActive={this.state.timerActive}
            gameState={gameState}
            scoreCard={this.scoreCard.bind(this)}
            failCard={this.failCard.bind(this)}
            nextCard={this.nextCard.bind(this)}
            endTurn={this.endTurn.bind(this)}
            startTimer={this.startTimer.bind(this)}
            clearTimer={this.clearTimer.bind(this)} />
        </div>
        <TeamDisplay gameState={gameState} chooseLeader={this.chooseLeader.bind(this)} usernames={this.state.usernames} />
        <ChatPanel messages={messages} gameState={gameState} />
      </ThemeProvider>
    );
  }
}

export default App;
