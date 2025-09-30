export type DifficultyLevel = 'easy' | 'medium' | 'hard'

export interface CandidateInfo {
  name: string
  email: string
  phone: string
}

export interface Question {
  id: string
  text: string
  difficulty: DifficultyLevel
  timeLimit: number
}

export interface Answer {
  questionId: string
  text: string
  score: number
  timeSpent: number
  aiEvaluation?: string
}

export interface ChatMessage {
  id: string
  type: 'system' | 'user' | 'ai'
  content: string
  timestamp: number
}

export interface InterviewSession {
  id: string
  candidateInfo: CandidateInfo
  resumeUploaded: boolean
  infoCollected: boolean
  currentQuestionIndex: number
  questions: Question[]
  answers: Answer[]
  chatHistory: ChatMessage[]
  startTime: number | null
  endTime: number | null
  finalScore: number | null
  summary: string | null
  status: 'pending' | 'info-collection' | 'in-progress' | 'completed'
}

export interface AppState {
  currentSession: InterviewSession | null
  completedSessions: InterviewSession[]
  activeTab: 'interviewee' | 'interviewer'
}

export interface TimerState {
  remainingTime: number
  isActive: boolean
}