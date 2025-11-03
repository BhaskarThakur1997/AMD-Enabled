**AMD-Enabled Outbound Dialer (Twilio + Next.js + Python AI)**

| Layer    | Tech                                |
| -------- | ----------------------------------- |
| Frontend | Next.js 14 (App Router, TypeScript) |
| Auth     | Better-Auth                         |
| DB       | PostgreSQL + Prisma                 |
| Calling  | Twilio Voice API + Media Streams    |
| AI AMD   | FastAPI + Hugging Face (wav2vec)    |
| Optional | Jambonz, Google Gemini Flash        |
| Deploy   | Docker + Docker Compose             |


**Features**

✅ Dial outbound calls via Web UI

✅ Answering Machine Detection (AMD) strategies:

| Strategy            | Description                  |
| ------------------- | ---------------------------- |
| Twilio Native AMD   | Basic AMD built-in           |
| Twilio + Jambonz    | SIP-enhanced accuracy        |
| Hugging Face Model  | ML streaming model (wav2vec) |
| Google Gemini Flash | LLM-driven real-time audio   |

✅ Detect human vs. voicemail

✅ Drop call on machine, connect if human

✅ Logs calls to Postgres

✅ Real-time call updates in UI

✅ Docker setup for local dev
