import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import ResumeUpload from './ResumeUpload'
import ChatInterface from './ChatInterface'

export default function IntervieweeTab() {
  const { currentSession } = useSelector((state: RootState) => state.interview)

  if (!currentSession) {
    return (
      <div className="max-w-2xl mx-auto">
        <ResumeUpload />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <ChatInterface />
    </div>
  )
}