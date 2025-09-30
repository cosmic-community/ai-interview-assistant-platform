import { Question, Answer, DifficultyLevel } from '../types'
import { generateId } from './utils'

// Simulated AI service - replace with actual AI API calls
export async function generateQuestion(difficulty: DifficultyLevel, questionNumber: number): Promise<Question> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  const questionsByDifficulty: Record<DifficultyLevel, string[]> = {
    easy: [
      "What is the difference between let, const, and var in JavaScript?",
      "Explain the concept of props in React and how they differ from state.",
    ],
    medium: [
      "How would you optimize the performance of a React application?",
      "Explain the event loop in Node.js and how it handles asynchronous operations.",
    ],
    hard: [
      "Design a system for handling real-time chat with 1 million concurrent users. What technologies would you use and why?",
      "Explain how you would implement authentication and authorization in a microservices architecture.",
    ],
  }

  const timeLimits: Record<DifficultyLevel, number> = {
    easy: 20,
    medium: 60,
    hard: 120,
  }

  const questions = questionsByDifficulty[difficulty]
  const questionText = questions[questionNumber % questions.length] || questions[0] || 'Default question'

  return {
    id: generateId(),
    text: questionText,
    difficulty,
    timeLimit: timeLimits[difficulty],
  }
}

export async function evaluateAnswer(question: Question, answer: string, timeSpent: number): Promise<Answer> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800))

  // Simple scoring logic - replace with actual AI evaluation
  const wordCount = answer.trim().split(/\s+/).length
  const timeBonus = timeSpent < question.timeLimit ? 0.1 : 0
  
  let baseScore = 0
  if (wordCount > 100) baseScore = 0.9
  else if (wordCount > 50) baseScore = 0.7
  else if (wordCount > 20) baseScore = 0.5
  else baseScore = 0.3

  const finalScore = Math.min(1, baseScore + timeBonus)

  const evaluation = `Answer demonstrates ${
    finalScore > 0.8 ? 'excellent' : finalScore > 0.6 ? 'good' : 'basic'
  } understanding. Word count: ${wordCount}. Time efficiency: ${
    timeBonus > 0 ? 'excellent' : 'adequate'
  }.`

  return {
    questionId: question.id,
    text: answer,
    score: Math.round(finalScore * 100),
    timeSpent,
    aiEvaluation: evaluation,
  }
}

export async function generateSummary(answers: Answer[]): Promise<{ score: number; summary: string }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  const totalScore = answers.reduce((sum, answer) => sum + answer.score, 0)
  const averageScore = Math.round(totalScore / answers.length)

  const performance = averageScore >= 80 ? 'excellent' : averageScore >= 60 ? 'good' : 'satisfactory'

  const summary = `The candidate demonstrated ${performance} performance across ${answers.length} questions. Average score: ${averageScore}/100. Strengths include clear communication and technical knowledge. Areas for improvement: provide more detailed examples and consider edge cases.`

  return {
    score: averageScore,
    summary,
  }
}