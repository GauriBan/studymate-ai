# StudyMate AI 📚

StudyMate AI is an AI-powered learning assistant that helps students understand difficult topics and practice their knowledge through AI-generated quizzes.

## Problem

Students often find difficult programming and technical topics hard to understand. They also need a simple way to practice what they have learned.

StudyMate AI provides simple topic explanations and short quizzes in one place.

## Features

- AI-powered topic explanations
- AI-generated 5-question quizzes
- Multiple-choice questions
- Automatic score calculation
- Learning results based on quiz performance
- Responsive mobile-friendly UI
- Secure Gemini API integration through backend

## How It Works

1. Student enters a topic.
2. The topic is sent to the backend.
3. Gemini AI generates an explanation or quiz.
4. The result is displayed in the frontend.
5. Student answers the quiz.
6. StudyMate AI calculates the score locally.

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Express.js
- Google Gemini API

## Project Structure

```text
studymate-ai/
├── src/
├── server/
│   ├── server.js
│   └── .env
├── public/
├── package.json
└── README.md