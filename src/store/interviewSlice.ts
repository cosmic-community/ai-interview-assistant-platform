import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState, InterviewSession, CandidateInfo, Question, Answer, ChatMessage } from '../types'
import { generateId } from '../lib/utils'

const initialState: AppState = {
  currentSession: null,
  completedSessions: [],
  activeTab: 'interviewee',
}

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    startNewSession: (state) => {
      state.currentSession = {
        id: generateId(),
        candidateInfo: { name: '', email: '', phone: '' },
        resumeUploaded: false,
        infoCollected: false,
        currentQuestionIndex: 0,
        questions: [],
        answers: [],
        chatHistory: [],
        startTime: null,
        endTime: null,
        finalScore: null,
        summary: null,
        status: 'pending',
      }
    },

    setResumeUploaded: (state, action: PayloadAction<Partial<CandidateInfo>>) => {
      if (state.currentSession) {
        state.currentSession.resumeUploaded = true
        state.currentSession.candidateInfo = {
          ...state.currentSession.candidateInfo,
          ...action.payload,
        }
        state.currentSession.status = 'info-collection'
      }
    },

    updateCandidateInfo: (state, action: PayloadAction<CandidateInfo>) => {
      if (state.currentSession) {
        state.currentSession.candidateInfo = action.payload
        state.currentSession.infoCollected = true
      }
    },

    addChatMessage: (state, action: PayloadAction<Omit<ChatMessage, 'id' | 'timestamp'>>) => {
      if (state.currentSession) {
        const message: ChatMessage = {
          ...action.payload,
          id: generateId(),
          timestamp: Date.now(),
        }
        state.currentSession.chatHistory.push(message)
      }
    },

    startInterview: (state, action: PayloadAction<Question[]>) => {
      if (state.currentSession) {
        state.currentSession.questions = action.payload
        state.currentSession.startTime = Date.now()
        state.currentSession.status = 'in-progress'
      }
    },

    addAnswer: (state, action: PayloadAction<Answer>) => {
      if (state.currentSession) {
        state.currentSession.answers.push(action.payload)
      }
    },

    nextQuestion: (state) => {
      if (state.currentSession) {
        state.currentSession.currentQuestionIndex += 1
      }
    },

    completeInterview: (state, action: PayloadAction<{ score: number; summary: string }>) => {
      if (state.currentSession) {
        state.currentSession.endTime = Date.now()
        state.currentSession.finalScore = action.payload.score
        state.currentSession.summary = action.payload.summary
        state.currentSession.status = 'completed'
        state.completedSessions.push(state.currentSession)
        state.currentSession = null
      }
    },

    setActiveTab: (state, action: PayloadAction<'interviewee' | 'interviewer'>) => {
      state.activeTab = action.payload
    },

    clearCurrentSession: (state) => {
      state.currentSession = null
    },
  },
})

export const {
  startNewSession,
  setResumeUploaded,
  updateCandidateInfo,
  addChatMessage,
  startInterview,
  addAnswer,
  nextQuestion,
  completeInterview,
  setActiveTab,
  clearCurrentSession,
} = interviewSlice.actions

export default interviewSlice.reducer