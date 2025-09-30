import { InterviewSession } from '../types'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { ArrowLeft, User, Mail, Phone, Award, Clock } from 'lucide-react'
import ChatMessage from './ChatMessage'

interface CandidateDetailProps {
  candidate: InterviewSession
  onBack: () => void
}

export default function CandidateDetail({ candidate, onBack }: CandidateDetailProps) {
  const interviewDuration = candidate.startTime && candidate.endTime
    ? Math.floor((candidate.endTime - candidate.startTime) / 1000 / 60)
    : 0

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {candidate.candidateInfo.name}
          </CardTitle>
          <CardDescription>Candidate Profile & Interview Results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-sm font-medium mb-2">Contact Information</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{candidate.candidateInfo.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{candidate.candidateInfo.phone}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Interview Details</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <span>Final Score: {candidate.finalScore}/100</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Duration: {interviewDuration} minutes</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-2">AI Summary</h4>
            <p className="text-sm text-muted-foreground">{candidate.summary}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Questions & Answers</CardTitle>
          <CardDescription>Detailed breakdown of interview responses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {candidate.questions.map((question, index) => {
              const answer = candidate.answers[index]
              
              if (!answer) return null

              return (
                <div key={question.id} className="border-b pb-4 last:border-0">
                  <div className="mb-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase">
                      Question {index + 1} ({question.difficulty})
                    </span>
                  </div>
                  
                  <p className="text-sm font-medium mb-3">{question.text}</p>
                  
                  <div className="bg-muted rounded-lg p-3 mb-2">
                    <p className="text-sm">{answer.text}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Time spent: {Math.floor(answer.timeSpent / 60)}m {answer.timeSpent % 60}s
                    </span>
                    <span className={`font-medium ${answer.score >= 80 ? 'text-green-600' : answer.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                      Score: {answer.score}/100
                    </span>
                  </div>

                  {answer.aiEvaluation && (
                    <p className="text-xs text-muted-foreground mt-2">{answer.aiEvaluation}</p>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Complete Chat History</CardTitle>
          <CardDescription>Full conversation transcript</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {candidate.chatHistory.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}