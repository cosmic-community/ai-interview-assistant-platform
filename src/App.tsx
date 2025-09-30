import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from './store/store'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import IntervieweeTab from './components/IntervieweeTab'
import InterviewerTab from './components/InterviewerTab'
import WelcomeBackModal from './components/WelcomeBackModal'

function App() {
  const { currentSession } = useSelector((state: RootState) => state.interview)

  return (
    <div className="min-h-screen bg-background">
      <WelcomeBackModal />
      
      <div className="container mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">AI Interview Assistant</h1>
          <p className="text-muted-foreground">
            Full-stack developer technical interview platform
          </p>
        </header>

        <Tabs defaultValue="interviewee" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="interviewee">Interviewee (Chat)</TabsTrigger>
            <TabsTrigger value="interviewer">Interviewer (Dashboard)</TabsTrigger>
          </TabsList>

          <TabsContent value="interviewee" className="mt-6">
            <IntervieweeTab />
          </TabsContent>

          <TabsContent value="interviewer" className="mt-6">
            <InterviewerTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App