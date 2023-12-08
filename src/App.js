import React, { Component } from 'react';
import './App.css';
import axios from 'axios'

class App extends Component {
  constructor() {
    super();
    this.state = {
      expanded: false,
      userInput: '',
      chatHistory: [],
      isTyping: false,
      context: {},
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
    const { userInput, chatHistory, context } = this.state; // Add a context variable
    if (userInput.trim() === '') {
      return;
    }
  
    this.setState({
      chatHistory: [...chatHistory, { text: userInput, isUser: true }],
      userInput: '',
      isTyping: true
    }, this.scrollToBottom);
  
    try {
      // Constructing the prompt for OpenAI
      const prompt = `As an academic advisor for Mississippi State University, respond to the following query:\n\n${userInput}`;
  
      // Sending request to your backend including the context
      const response = await axios.post('http://localhost:5000/api/chat', {
        prompt: prompt,
        context: context // Include the updated context
      });
  
      const data = await response.data;
  
      this.setState({
        chatHistory: [...this.state.chatHistory, { text: data.response || data.followUp, isUser: false }],
        context: data.context || {}, // Update the context
        isTyping: false
      }, this.scrollToBottom);
    } catch (error) {
        console.error('Error:', error);
        console.error('Error Details:', error.response || error.message);
        this.setState({
          chatHistory: [...this.state.chatHistory, { text: 'Sorry, there was an error processing your request.', isUser: false }],
          isTyping: false
        }, this.scrollToBottom);
      }
    };

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
  };

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
