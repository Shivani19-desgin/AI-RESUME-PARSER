class ResumeEnv:
    def __init__(self):
        self.data = None

    def reset(self):
        self.data = {
            "job_description": "Python developer with ML",
            "resumes": [
                "Python ML Data Science",
                "Java Developer"
            ],
            "correct_answer": 0
        }
        return self.data

    def step(self, action):
        # extract values
        index = action["index"]
        score = action["score"]

        # reward = real score (0–1)
        reward = score

        return self.data, reward, True, {}

    def state(self):
        return self.data