# Backend (Agora Token Server)

This backend issues short-lived Agora RTC tokens and provides Groq APIs for speech-to-text and conversational agent replies.

## Setup

1. Install dependencies:
   npm install

2. Copy env file:
   cp .env.example .env

3. Fill in your Agora credentials in `.env`:
   - `AGORA_APP_ID`
   - `AGORA_APP_CERTIFICATE`
   - `GROQ_API_KEY`

Optional model overrides:
- `GROQ_CHAT_MODEL` (default: `llama-3.3-70b-versatile`)
- `GROQ_STT_MODEL` (default: `whisper-large-v3`)

4. Run server:
   npm run dev

Server runs on `http://localhost:4000` by default.

## Endpoints

- `GET /health`
- `POST /agora/token`
  - body: `{ "channelName": "loan-verification", "uid": 0 }`
- `POST /groq/stt`
   - multipart form-data: `audio=<audio-blob>`
- `POST /groq/chat`
   - body: `{ "messages": [{ "role": "user", "content": "..." }] }`
