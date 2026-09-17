import { useState } from "react";
import "./App.css";

function App() {
  const [topic, setTopic] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState([]);
const [selectedAnswers, setSelectedAnswers] = useState({});
const [score, setScore] = useState(null);
const [quizLoading, setQuizLoading] = useState(false);

  const askStudyMate = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch("http://localhost:5000/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setAnswer(data.answer);
    } catch (error) {
      setAnswer("Sorry, something went wrong. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generateQuiz = async () => {
  if (!topic.trim()) return;

  setQuizLoading(true);
  setQuiz([]);
  setScore(null);
  setSelectedAnswers({});

  try {
    const response = await fetch("http://localhost:5000/api/quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Quiz generation failed");
    }

    setQuiz(data.quiz);
  } catch (error) {
    console.error(error);
    alert("Could not generate quiz. Please try again.");
  } finally {
    setQuizLoading(false);
  }
};

const submitQuiz = () => {
  let totalScore = 0;

  quiz.forEach((question, index) => {
    const selected = Number(selectedAnswers[index]);
    const correct = Number(question.answer);

    if (!Number.isNaN(selected) && selected === correct) {
      totalScore++;
    }
  });

  setScore(totalScore);
};
<section className="results-section" id="results">
  <h2>Your Learning Result</h2>

  {score !== null ? (
    <div className="result-card">
      <h3>Score: {score}/5</h3>

      <p>
        {score === 5
          ? "Excellent! You have a strong understanding of this topic."
          : score >= 3
          ? "Good job! Keep practicing this topic."
          : "You need more practice on this topic."}
      </p>

      <p>
        Topic practiced: <strong>{topic}</strong>
      </p>
    </div>
  ) : (
    <div className="result-card">
      <p>Complete a quiz to see your result.</p>
    </div>
  )}
</section>

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">📚 StudyMate AI</div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#learn">Learn</a>
          <a href="#quiz">Quiz</a>
          <a href="#results">Results</a>
        </div>
      </nav>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <p className="tagline">AI-POWERED LEARNING ASSISTANT</p>

            <h1>
              Learn smarter.
              <br />
              <span>Practice better.</span>
            </h1>

            <p className="hero-text">
              Understand difficult topics, practice with AI-generated quizzes,
              and improve your weak areas.
            </p>

            <button className="primary-btn">Start Learning →</button>
          </div>

          <div className="hero-card">
            <div className="card-icon">🤖</div>

            <h3>What do you want to learn?</h3>

            <textarea
              placeholder="Example: Explain Java HashMap in simple words..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />

          <button
  className="ask-btn"
  onClick={askStudyMate}
  disabled={loading || !topic.trim()}
>
  {loading ? "Thinking..." : "Ask StudyMate"}
</button>

            {answer && (
              <div className="answer-box">
                <h3>StudyMate's Answer</h3>
                <p>{answer}</p>
              </div>
            )}
          </div>
        </section>

        <section className="quiz-section" >
  <h2>Test Your Knowledge</h2>

  <p>Enter a topic above and generate a quick 5-question quiz.</p>

  <button
    className="primary-btn"
    onClick={generateQuiz}
    disabled={quizLoading || !topic.trim()}
  >
    {quizLoading ? "Generating..." : "Generate Quiz"}
  </button>

  {quiz.length > 0 && (
    <div className="quiz-container">
      {quiz.map((question, index) => (
        <div className="quiz-card" key={index}>
          <h3>
            {index + 1}. {question.question}
          </h3>

          {question.options.map((option, optionIndex) => (
            <label key={optionIndex} className="option">
              <input
                type="radio"
                name={`question-${index}`}
                checked={selectedAnswers[index] === optionIndex}
                onChange={() =>
                  setSelectedAnswers({
                    ...selectedAnswers,
                    [index]: optionIndex,
                  })
                }
              />
              {option}
            </label>
          ))}
        </div>
      ))}

      <button className="primary-btn" onClick={submitQuiz}>
        Submit Quiz
      </button>

      {score !== null && (
        <div className="score-box">
          <h2>Your Score: {score}/5</h2>
          <p>
            {score === 5
              ? "Excellent! 🎉"
              : score >= 3
              ? "Good job! Keep practicing."
              : "Keep learning and try again."}
          </p>
        </div>
      )}
    </div>
  )}
</section>

        <section className="features" id="learn">
          <h2>Everything you need to learn</h2>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">💡</div>
              <h3>Explain Topics</h3>
              <p>
                Get difficult concepts explained in simple and easy language.
              </p>
            </div>

            <div className="feature-card" >
              <div className="feature-icon">📝</div>
              <h3>AI Quizzes</h3>
              <p>
                Generate practice questions based on the topic you are
                learning.
              </p>
            </div>

            <div className="feature-card" >
              <div className="feature-icon">📊</div>
              <h3>Track Progress</h3>
              <p>
                See your quiz scores and identify topics that need more
                practice.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;