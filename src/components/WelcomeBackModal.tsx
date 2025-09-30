import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store/store'
import { clearCurrentSession } from '../store/interviewSlice'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'

export default function WelcomeBackModal() {
  const dispatch = useDispatch()
  const { currentSession } = useSelector((state: RootState) => state.interview)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (currentSession && currentSession.status !== 'completed') {
      setOpen(true)
    }
  }, [currentSession])

  const handleContinue = () => {
    setOpen(false)
  }

  const handleStartNew = () => {
    dispatch(clearCurrentSession())
    setOpen(false)
  }

  if (!currentSession || currentSession.status === 'completed') {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome Back!</DialogTitle>
          <DialogDescription>
            You have an unfinished interview session. Would you like to continue where you left off?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            <strong>Candidate:</strong> {currentSession.candidateInfo.name || 'Not provided'}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Status:</strong>{' '}
            {currentSession.status === 'pending' && 'Resume upload pending'}
            {currentSession.status === 'info-collection' && 'Collecting information'}
            {currentSession.status === 'in-progress' && `Question ${currentSession.currentQuestionIndex + 1} of ${currentSession.questions.length}`}
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleStartNew}>
            Start New Session
          </Button>
          <Button onClick={handleContinue}>Continue Session</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}