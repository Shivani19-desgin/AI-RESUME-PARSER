from fastapi import FastAPI
from env.environment import ResumeEnv

app = FastAPI()

env = ResumeEnv()

@app.post("/reset")
def reset():
    return env.reset()

@app.post("/step")
def step(action: dict):
    state, reward, done, info = env.step(action)
    return {
        "state": state,
        "reward": reward,
        "done": done,
        "info": info
    }

@app.get("/state")
def get_state():
    return env.state()