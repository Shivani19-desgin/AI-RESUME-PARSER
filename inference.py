from env.environment import ResumeEnv

# 🔥 import your real function
from backend.parser import extract_skills

env = ResumeEnv()
state = env.reset()

job_description = state["job_description"]

# extract job skills
job_skills = extract_skills(job_description)

scores = []

for resume in state["resumes"]:
    
    # extract skills from resume
    resume_skills = extract_skills(resume)

    # 🔥 scoring logic
    match_count = len(set(job_skills) & set(resume_skills))
    total = len(job_skills) if len(job_skills) > 0 else 1

    score = match_count / total   # gives value between 0–1

    scores.append(score)

best_index = scores.index(max(scores))
best_score = scores[best_index]

action = {
    "index": best_index,
    "score": best_score
}

_, reward, _, _ = env.step(action)
print("[START]")
print("[STEP]", reward)
print("[END]")