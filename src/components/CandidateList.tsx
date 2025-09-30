import { InterviewSession } from '../types'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { ChevronRight, User, Mail, Phone, Award } from 'lucide-react'

interface CandidateListProps {
  candidates: InterviewSession[]
  onSelectCandidate: (candidate: InterviewSession) => void
}

export default function CandidateList({ candidates, onSelectCandidate }: CandidateListProps) {
  if (candidates.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No completed interviews yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {candidates.map((candidate) => (
        <Card key={candidate.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">{candidate.candidateInfo.name}</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{candidate.candidateInfo.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{candidate.candidateInfo.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <Award className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">
                    Final Score: {candidate.finalScore}/100
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {candidate.summary}
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onSelectCandidate(candidate)}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}