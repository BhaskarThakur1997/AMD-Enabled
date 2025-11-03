from fastapi import FastAPI, Request
import uvicorn, random


app = FastAPI()


@app.post('/predict')
async def predict(req: Request):
await req.body()
return { "status": random.choice(["human", "machine"]), "confidence": 0.7 }


if __name__ == "__main__":
uvicorn.run(app, host="0.0.0.0", port=5001) 
