import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'
import { formatTime } from '../lib/utils'

interface QuestionTimerProps {
  duration: number
  onTimeout: () => void
  isActive: boolean
}

export default function QuestionTimer({ duration, onTimeout, isActive }: QuestionTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    if (!isActive) return

    setTimeLeft(duration)

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          onTimeout()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [duration, isActive, onTimeout])

  const percentage = (timeLeft / duration) * 100
  const isLowTime = percentage < 25

  return (
    <div className="flex items-center gap-2">
      <Clock className={`h-4 w-4 ${isLowTime ? 'text-destructive' : 'text-muted-foreground'}`} />
      <span className={`text-sm font-medium ${isLowTime ? 'text-destructive' : ''}`}>
        {formatTime(timeLeft)}
      </span>
    </div>
  )
}