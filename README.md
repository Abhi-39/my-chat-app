# Hasura + n8n + OpenRouter Chatbot

## Overview
This project is a real-time chatbot that combines:
- **Hasura GraphQL Engine**: Manages database, GraphQL API, real-time subscriptions, and secure access with Row-Level Security (RLS).
- **n8n Workflow Automation**: Listens to new user messages in Hasura, calls OpenRouter AI API for bot replies, and inserts responses back into Hasura.
- **React Frontend**: A simple chat UI that sends user messages and displays bot replies in real time via GraphQL subscriptions.

### Architecture Flow
1. User sends a message → inserted into Hasura `messages` table.
2. Hasura triggers an Event Trigger → calls n8n webhook.
3. n8n invokes OpenRouter AI to get a reply.
4. n8n posts the bot’s reply to Hasura → frontend subscription updates instantly.

***

## Folder Structure
```
project/
│
├── metadata.json               # Hasura metadata export
├── n8n-workflow.json           # Exported n8n workflow JSON (fixed with dynamic chat_id & sender)
│
├── frontend/                   # React project source code
│   ├── public
│   │    └── index.html         # Main HTML file
│   ├── src
│   │    ├── App.js             # Main component
│   │    ├── index.js           # React entry point
│   │    └── components
│   │         └── Chat.js       # Chat functionality component
│   ├── package.json            # npm config for frontend
│   └── README.md               # Frontend-specific documentation (optional)
│
└── README.md                   # Main project README (Hasura + n8n + React + deployment guide)

```

***

## Setup Instructions

### 1. Hasura Backend
- Deploy Hasura (e.g., on Nhost, Hasura Cloud, or self-hosted).
- Import `metadata.json` using Hasura Console:
  - Go to **Settings → Metadata Actions → Import metadata**.
- Confirm `chats` and `messages` tables with RLS policies are in place.
- Ensure the Event Trigger on `messages` INSERT events is active and linked to your n8n webhook URL.
- Test RLS by querying with different user IDs to confirm data isolation.

### 2. n8n Workflow
- Import `n8n-workflow.json` into your running n8n instance.
- Configure:
  - The webhook URL to match Hasura Event Trigger.
  - OpenRouter API key securely in n8n credentials or environment.
  - Hasura Admin Secret or JWT token as needed for authenticated inserts.
- Ensure your mutation for inserting bot replies uses `sender: "bot"` and dynamically references the proper `chat_id`.
- Activate and publish the workflow.

### 3. React Frontend
- In the `frontend/` folder, install dependencies:
  ```
  npm install
  ```
- Create a `.env` file in the `frontend` root with:
  ```
  REACT_APP_GRAPHQL_ENDPOINT=https:///v1/graphql
  ```
- Run frontend locally:
  ```
  npm start
  ```
- Build frontend for deployment:
  ```
  npm run build
  ```

### 4. Environment Variables
- For local development, set variables in `.env` prefixed with `REACT_APP_`.
- For production (e.g., Netlify), configure the same environment variables securely in the deployment platform’s environment settings:
  ```
  REACT_APP_GRAPHQL_ENDPOINT=https:///v1/graphql
  ```

***

## Testing Instructions

### Using Hasura Console
1. Create a new chat by mutation:
   ```graphql
   mutation {
     insert_chats_one(object: { title: "Test Chat" }) {
       id
     }
   }
   ```
2. Subscribe to messages in that chat:
   ```graphql
   subscription {
     messages(where: { chat_id: { _eq: "REPLACE_UUID" } }) {
       id
       sender
       content
       created_at
     }
   }
   ```
3. Insert a user message:
   ```graphql
   mutation {
     insert_messages_one(object: { chat_id: "REPLACE_UUID", sender: "user", content: "Hello bot!" }) {
       id
     }
   }
   ```
4. The bot reply will appear automatically within seconds via the workflow automation.

### Using React Frontend
1. Open the React frontend app.
2. Set or select a valid `chat_id` connected to your Hasura backend.
3. Send a message using the UI.
4. Observe the bot reply appear in real time.

***

## Security (Row-Level Security - RLS)
- RLS is enforced on `chats` and `messages` tables.
- Users can only read or write their own chats/messages.
- Tested by using different `x-hasura-user-id` headers to verify isolation.

***

## Live Links (Optional)
- Frontend URL: ``
- Hasura GraphQL Endpoint: ``
- Test User Credentials or JWT Tokens: ``

***

## Notes
- Keep n8n workflow active to process messages and generate bot replies.
- Adjust environment variables when moving between development and production.
- Make sure the bot reply mutation uses `"bot"` as the sender and dynamically assigns the `chat_id`.

***
Here’s how you can add the **Netlify deployment steps** to your README including your live hosted URL `chatter-box-hasura.netlify.app`. This will make the submission complete with clear deployment and access info.

***

## Add to Your README.md under a new section like this:

### Deploying the React Frontend to Netlify

1. **Connect your GitHub repository** with the React project to your Netlify account at [netlify.com](https://netlify.com).

2. **Create a new site from Git** in the Netlify dashboard and select your repository.

3. **Configure build settings:**
   - **Build command:**  
     ```
     npm run build
     ```
   - **Publish directory:**  
     ```
     build
     ```

4. **Add Environment Variables** under **Site settings → Build & deploy → Environment → Environment variables**:
   ```
   REACT_APP_GRAPHQL_ENDPOINT=https://your-hasura-endpoint/v1/graphql
   ```
   *(Replace with your actual Hasura endpoint.)*

5. **Deploy the site:**  
   Click **Deploy site** and wait for the build and deployment process to finish.

6. **Access your live app:**  
   Your site is hosted at:  
   ```
   https://chatter-box-hasura.netlify.app
   ```

7. **Test the deployment:**  
   - Open the live URL in a browser.  
   - Create or select a chat.  
   - Send messages and observe the bot responses in real time.

***
