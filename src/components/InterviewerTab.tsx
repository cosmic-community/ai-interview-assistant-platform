import { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import CandidateList from './CandidateList'
import CandidateDetail from './CandidateDetail'
import { InterviewSession } from '../types'

export default function InterviewerTab() {
  const { completedSessions } = useSelector((state: RootState) => state.interview)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'score' | 'date'>('score')
  const [selectedCandidate, setSelectedCandidate] = useState<InterviewSession | null>(null)

  // Filter and sort candidates
  const filteredCandidates = completedSessions
    .filter((session) => {
      const searchLower = searchTerm.toLowerCase()
      return (
        session.candidateInfo.name.toLowerCase().includes(searchLower) ||
        session.candidateInfo.email.toLowerCase().includes(searchLower)
      )
    })
    .sort((a, b) => {
      if (sortBy === 'score') {
        return (b.finalScore || 0) - (a.finalScore || 0)
      } else {
        return (b.endTime || 0) - (a.endTime || 0)
      }
    })

  if (selectedCandidate) {
    return (
      <CandidateDetail
        candidate={selectedCandidate}
        onBack={() => setSelectedCandidate(null)}
      />
    )
  }

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Candidate Dashboard</CardTitle>
          <CardDescription>
            View and manage completed interviews
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Select value={sortBy} onValueChange={(value: 'score' | 'date') => setSortBy(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score">Sort by Score</SelectItem>
                <SelectItem value="date">Sort by Date</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <CandidateList
            candidates={filteredCandidates}
            onSelectCandidate={setSelectedCandidate}
          />
        </CardContent>
      </Card>
    </div>
  )
}