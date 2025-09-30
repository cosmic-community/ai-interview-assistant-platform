import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Upload, FileText } from 'lucide-react'
import { startNewSession, setResumeUploaded, addChatMessage } from '../store/interviewSlice'
import { parseResume } from '../lib/resumeParser'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

export default function ResumeUpload() {
  const dispatch = useDispatch()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF or DOCX file')
      return
    }

    setUploading(true)
    setError(null)

    try {
      // Parse resume
      const extractedInfo = await parseResume(file)

      // Start new session
      dispatch(startNewSession())
      dispatch(setResumeUploaded(extractedInfo))

      // Add welcome message
      dispatch(addChatMessage({
        type: 'system',
        content: 'Resume uploaded successfully! Let me verify your information.',
      }))

      // Check for missing fields
      const missingFields: string[] = []
      if (!extractedInfo.name) missingFields.push('name')
      if (!extractedInfo.email) missingFields.push('email')
      if (!extractedInfo.phone) missingFields.push('phone')

      if (missingFields.length > 0) {
        dispatch(addChatMessage({
          type: 'ai',
          content: `I need to collect some information. Please provide your ${missingFields.join(', ')}.`,
        }))
      } else {
        dispatch(addChatMessage({
          type: 'ai',
          content: `Great! I have all your information. Ready to start the interview?`,
        }))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse resume')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Your Resume</CardTitle>
        <CardDescription>
          Upload your resume (PDF or DOCX) to begin the AI-powered interview process
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          
          <div className="mb-4">
            <label htmlFor="resume-upload">
              <Button
                disabled={uploading}
                className="cursor-pointer"
                onClick={() => document.getElementById('resume-upload')?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                {uploading ? 'Uploading...' : 'Choose File'}
              </Button>
            </label>
            <input
              id="resume-upload"
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          <p className="text-sm text-muted-foreground">
            Supported formats: PDF, DOCX
          </p>

          {error && (
            <p className="text-sm text-destructive mt-4">{error}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}