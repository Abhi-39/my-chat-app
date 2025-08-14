import React from 'react';
import Chat from './components/Chat';

// Replace with one of your actual chat UUIDs from Hasura
const chatId = 'ba7adc43-908c-40ac-94f6-4db1a2951b85';

function App() {
  return (
    <div>
      <h1>Chat Bot</h1>
      <Chat chatId={chatId} />
    </div>
  );
}

export default App;