# AI Loan Project

## Local Development

1. Start backend token server:
	- Go to `backend`
	- Run `npm install`
	- Copy `.env.example` to `.env` and set Agora credentials
	- Run `npm run dev`

2. Start frontend:
	- Go to `client`
	- Run `npm install`
	- Ensure `VITE_BACKEND_URL` points to backend (default: `http://localhost:4000`)
	- Run `npm run dev`