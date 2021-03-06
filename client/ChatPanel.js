import React from 'react';
import { Button } from '@zendeskgarden/react-buttons';

class ChatPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newMessages: false,
    };
  }

  scrollToBottom(force) {
    const objDiv = document.getElementById('messagePanel');
    if (force || objDiv.scrollHeight - objDiv.scrollTop < 250) {
      objDiv.scrollTop = objDiv.scrollHeight;
      this.setState({ newMessages: false });
      return true;
    }
    return false;
  }

  clearNewMessagesIfRead() {
    if (this.state.newMessages === false) { return; }
    const objDiv = document.getElementById('messagePanel');
    if (objDiv.scrollHeight - objDiv.scrollTop < 250) {
      this && this.setState({ newMessages: false });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.messages === this.props.messages) { return; }
    if (!this.scrollToBottom() && this.state.newMessages === false) {
      this.setState({ newMessages: true });
    }
  }

  // TODO: scrolling messages
  render() {
    const { messages } = this.props;
    const { newMessages } = this.state;
    return (
      <div>
        <div id="messagePanel" className="messages" onScroll={this.clearNewMessagesIfRead.bind(this)}>
          { messages.map((m, i) => (
            <p className={`chat-message chat-message-${m.color}`} key={i}>{m.message}</p>))}
        </div>
        { newMessages && <span className="new-messages" onClick={() => this.scrollToBottom(true)}>New messages</span> }
      </div>
    );
  }
}

export default ChatPanel;
