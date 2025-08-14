import React, { useEffect, useState } from 'react';
import { gqlClient, wsClient } from '../graphqlClient';

const GET_MESSAGES_SUBSCRIPTION = `
  subscription GetMessages($chat_id: uuid!) {
    messages(where: { chat_id: { _eq: $chat_id } }, order_by: { created_at: asc }) {
      id
      sender
      content
      created_at
    }
  }
`;

const SEND_MESSAGE_MUTATION = `
  mutation SendUserMessage($chat_id: uuid!, $content: String!) {
    insert_messages_one(object: { chat_id: $chat_id, sender: "user", content: $content }) {
      id
    }
  }
`;

const Chat = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // Subscribe to messages
  useEffect(() => {
    if (!chatId) return;

    let isMounted = true;

    const onNext = (data) => {
      if (isMounted && data.data?.messages) {
        setMessages(data.data.messages);
      }
    };

    const onError = (err) => {
      console.error('Subscription error', err);
    };

    const onComplete = () => {
      console.log('Subscription complete');
    };

    const dispose = wsClient.subscribe(
      {
        query: GET_MESSAGES_SUBSCRIPTION,
        variables: { chat_id: "2a199b24-40b2-4bdd-9140-76bdddaa81b7" },
      },
      {
        next: onNext,
        error: onError,
        complete: onComplete,
      }
    );

    return () => {
      isMounted = false;
      dispose();
    };
  }, [chatId]);

  // Send message handler
  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      console.log('Sending:', { chat_id: "2a199b24-40b2-4bdd-9140-76bdddaa81b7", content: input });
      await gqlClient.request(SEND_MESSAGE_MUTATION, {
        chat_id: "2a199b24-40b2-4bdd-9140-76bdddaa81b7",
        content: input,
      });
      setInput('');
      console.log('Message sent!');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">My Chat App</div>
      <div className="chat-messages">
        {messages.map(({ id, sender, content }) => (
          <div
            key={id}
            className={`message ${sender === 'user' ? 'user' : 'bot'}`}
          >
            {content}
          </div>
        ))}
      </div>
      <div className="chat-input-area">
        <input
          type="text"
          className="chat-input"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
        />
        <button className="send-btn" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;