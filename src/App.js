import React, { Component } from 'react';
import './App.css';
import { sendMsgToOpenAI } from './openai'; // Import the OpenAI function

class App extends Component {
  constructor() {
    super();
    this.state = {
      expanded: false,
      userInput: '',
      chatHistory: [],
      isTyping: false, 
    };
    this.chatHistoryRef = React.createRef();
  }

  toggleChatbot = () => {
    this.setState((prevState) => ({
      expanded: !prevState.expanded,
    }));
  };

  handleUserInput = (e) => {
    this.setState({ userInput: e.target.value });
  };

  handleUserSubmit = async () => {
    const { userInput, chatHistory } = this.state;
    if (userInput.trim() === '') {
      return;
    }

    // Add user input to chat history
    this.setState({ 
      chatHistory: [...chatHistory, { text: userInput, isUser: true }],
      userInput: '', 
      isTyping: true 
    });

    try {
      const botResponse = await sendMsgToOpenAI(userInput);

      // Add chatbot response to chat history
      this.setState({ 
        chatHistory: [...this.state.chatHistory, { text: botResponse, isUser: false }],
        isTyping: false
      });
    } catch (error) {
      console.error('Error sending request to OpenAI API:', error);
      this.setState({
        chatHistory: [...this.state.chatHistory, { text: 'Sorry, there was an error processing your message.', isUser: false }],
        isTyping: false
      });
    }
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleUserSubmit();
    }
  };

  scrollToBottom = () => {
    if (this.chatHistoryRef.current) {
      const container = this.chatHistoryRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  componentDidMount() {
    this.scrollToBottom();
  }

  renderChat = () => {
    const { chatHistory, isTyping } = this.state;

    const chatMessages = chatHistory.map((message, index) => (
      <div key={index} className={`chat-bubble ${message.isUser ? 'user' : 'chatbot'}`}>
        {message.text}
      </div>
    ));

    const typingIndicator = isTyping && (
      <div key="typing-indicator" className="chat-bubble chatbot typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    );

    return chatMessages.concat(typingIndicator);
  }

  render() {
    const { expanded, userInput } = this.state;

    return (
      <div className={`chatbot-container ${expanded ? 'expanded' : 'collapsed'}`}>
        <div className="chat-header" onClick={this.toggleChatbot}>
          Chatbot
        </div>
        <div className="chat-history" ref={this.chatHistoryRef}>
          {this.renderChat()}
        </div>
        {expanded && (
          <div className="chat-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={userInput}
              onChange={this.handleUserInput}
              onKeyPress={this.handleKeyPress}
            />
            <button onClick={this.handleUserSubmit}>Send</button>
          </div>
        )}
      </div>
    );
  }
}

export default App;
