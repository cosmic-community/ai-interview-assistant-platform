import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store/store'
import { updateCandidateInfo, addChatMessage, startInterview, addAnswer, nextQuestion, completeInterview } from '../store/interviewSlice'
import { generateQuestion, evaluateAnswer, generateSummary } from '../lib/aiService'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent } from './ui/card'
import { Progress } from './ui/progress'
import ChatMessage from './ChatMessage'
import QuestionTimer from './QuestionTimer'

export default function ChatInterface() {
  const dispatch = useDispatch()
  const { currentSession } = useSelector((state: RootState) => state.interview)
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [answerStartTime, setAnswerStartTime] = useState<number | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentSession?.chatHistory])

  if (!currentSession) return null

  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return

    const message = input.trim()
    setInput('')
    setIsProcessing(true)

    // Add user message
    dispatch(addChatMessage({ type: 'user', content: message }))

    try {
      // Handle info collection phase
      if (currentSession.status === 'info-collection' && !currentSession.infoCollected) {
        const missingFields: string[] = []
        if (!currentSession.candidateInfo.name) missingFields.push('name')
        if (!currentSession.candidateInfo.email) missingFields.push('email')
        if (!currentSession.candidateInfo.phone) missingFields.push('phone')

        // Simple parsing - in production, use more sophisticated NLP
        const candidateInfo = { ...currentSession.candidateInfo }
        
        if (missingFields.includes('name') && !message.includes('@')) {
          candidateInfo.name = message
        }
        if (missingFields.includes('email') && message.includes('@')) {
          candidateInfo.email = message
        }
        if (missingFields.includes('phone') && /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(message)) {
          candidateInfo.phone = message
        }

        dispatch(updateCandidateInfo(candidateInfo))

        const stillMissing: string[] = []
        if (!candidateInfo.name) stillMissing.push('name')
        if (!candidateInfo.email) stillMissing.push('email')
        if (!candidateInfo.phone) stillMissing.push('phone')

        if (stillMissing.length > 0) {
          dispatch(addChatMessage({
            type: 'ai',
            content: `Thank you! Please also provide your ${stillMissing[0]}.`,
          }))
        } else {
          dispatch(addChatMessage({
            type: 'ai',
            content: 'Perfect! All information collected. Ready to start the interview? Type "yes" to begin.',
          }))
        }
      }

      // Handle interview start
      if (currentSession.infoCollected && currentSession.status === 'info-collection' && message.toLowerCase().includes('yes')) {
        // Generate all questions
        const questions = []
        questions.push(await generateQuestion('easy', 0))
        questions.push(await generateQuestion('easy', 1))
        questions.push(await generateQuestion('medium', 0))
        questions.push(await generateQuestion('medium', 1))
        questions.push(await generateQuestion('hard', 0))
        questions.push(await generateQuestion('hard', 1))

        dispatch(startInterview(questions))
        dispatch(addChatMessage({
          type: 'ai',
          content: `Great! Let's begin. Question 1 of 6 (Easy):`,
        }))
        dispatch(addChatMessage({
          type: 'system',
          content: questions[0]?.text || '',
        }))
        setAnswerStartTime(Date.now())
      }
    } catch (error) {
      dispatch(addChatMessage({
        type: 'system',
        content: 'An error occurred. Please try again.',
      }))
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSubmitAnswer = async (timedOut = false) => {
    if (isProcessing) return
    
    const answer = timedOut ? currentAnswer : input
    if (!answer.trim()) return

    setIsProcessing(true)
    setInput('')
    setCurrentAnswer('')

    const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex]
    if (!currentQuestion) {
      setIsProcessing(false)
      return
    }

    const timeSpent = answerStartTime ? Math.floor((Date.now() - answerStartTime) / 1000) : 0

    // Add user answer
    dispatch(addChatMessage({ type: 'user', content: answer }))

    try {
      // Evaluate answer
      const evaluatedAnswer = await evaluateAnswer(currentQuestion, answer, timeSpent)
      dispatch(addAnswer(evaluatedAnswer))

      dispatch(addChatMessage({
        type: 'ai',
        content: `Score: ${evaluatedAnswer.score}/100. ${evaluatedAnswer.aiEvaluation}`,
      }))

      // Move to next question or complete
      if (currentSession.currentQuestionIndex < currentSession.questions.length - 1) {
        dispatch(nextQuestion())
        const nextQuestionIndex = currentSession.currentQuestionIndex + 1
        const nextQuestion = currentSession.questions[nextQuestionIndex]

        if (nextQuestion) {
          dispatch(addChatMessage({
            type: 'ai',
            content: `Question ${nextQuestionIndex + 1} of ${currentSession.questions.length} (${nextQuestion.difficulty}):`,
          }))
          dispatch(addChatMessage({
            type: 'system',
            content: nextQuestion.text,
          }))
          setAnswerStartTime(Date.now())
        }
      } else {
        // Complete interview
        const allAnswers = [...currentSession.answers, evaluatedAnswer]
        const { score, summary } = await generateSummary(allAnswers)
        
        dispatch(completeInterview({ score, summary }))
        dispatch(addChatMessage({
          type: 'ai',
          content: `Interview completed! Final score: ${score}/100. ${summary}`,
        }))
      }
    } catch (error) {
      dispatch(addChatMessage({
        type: 'system',
        content: 'Error processing answer. Please try again.',
      }))
    } finally {
      setIsProcessing(false)
    }
  }

  const handleTimeout = () => {
    handleSubmitAnswer(true)
  }

  const isInterviewActive = currentSession.status === 'in-progress'
  const currentQuestion = isInterviewActive ? currentSession.questions[currentSession.currentQuestionIndex] : null
  const progress = isInterviewActive ? ((currentSession.currentQuestionIndex + 1) / currentSession.questions.length) * 100 : 0

  return (
    <Card className="h-[600px] flex flex-col">
      {isInterviewActive && (
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              Question {currentSession.currentQuestionIndex + 1} of {currentSession.questions.length}
            </span>
            {currentQuestion && (
              <QuestionTimer
                duration={currentQuestion.timeLimit}
                onTimeout={handleTimeout}
                isActive={true}
              />
            )}
          </div>
          <Progress value={progress} />
        </div>
      )}

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentSession.chatHistory.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={chatEndRef} />
      </CardContent>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              if (isInterviewActive) {
                setCurrentAnswer(e.target.value)
              }
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                if (isInterviewActive) {
                  handleSubmitAnswer()
                } else {
                  handleSendMessage()
                }
              }
            }}
            placeholder={isInterviewActive ? 'Type your answer...' : 'Type your message...'}
            disabled={isProcessing || currentSession.status === 'completed'}
          />
          <Button
            onClick={isInterviewActive ? () => handleSubmitAnswer() : handleSendMessage}
            disabled={isProcessing || !input.trim() || currentSession.status === 'completed'}
          >
            {isProcessing ? 'Processing...' : 'Send'}
          </Button>
        </div>
      </div>
    </Card>
  )
}