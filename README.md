# AI Interview Assistant Platform

![App Preview](https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&h=300&fit=crop&auto=format)

A comprehensive AI-powered interview assistant that streamlines technical interviews with intelligent resume processing, real-time synchronization, and advanced candidate evaluation.

## Features

- **Dual Interface System**: Separate Interviewee (chat) and Interviewer (dashboard) tabs with real-time synchronization
- **Smart Resume Upload**: Automatic PDF/DOCX parsing with intelligent field extraction (Name, Email, Phone)
- **Dynamic AI Interview Flow**: Progressive difficulty system with 6 questions (2 Easy → 2 Medium → 2 Hard)
- **Advanced Timer System**: Question-specific countdowns (Easy: 20s, Medium: 60s, Hard: 120s) with auto-submission
- **Comprehensive Persistence**: Full state preservation using IndexedDB with automatic session recovery
- **Welcome Back Modal**: Smart detection and restoration of incomplete interview sessions
- **Rich Interviewer Dashboard**: Sortable candidate list with detailed performance analytics
- **Detailed Candidate Profiles**: Complete chat history, scores, and AI-generated summaries
- **Search & Filter**: Advanced candidate discovery and sorting capabilities
- **Responsive Design**: Modern, clean UI built with shadcn/ui and Tailwind CSS

## ## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmicjs.com/projects/new?clone_bucket=68dbb7b21df94af144a25df5&clone_repository=68dbb9021df94af144a25dff)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> No content model prompt provided - app built from existing content structure

### Code Generation Prompt

> Build a React app that works as an AI-powered interview assistant. It must:
> Provide two tabs: Interviewee (chat) and Interviewer (dashboard). Both stay synced.
> ● Interviewee (chat)
> ○ Let a candidate upload a resume (PDF required, DOCX optional).
> ○ Extract Name, Email, Phone from the resume; if anything is missing, the chatbot
> collects it before starting the interview.
> ○ Run a timed interview where AI generates questions and judges answers.
> ● Interviewer (dashboard)
> ○ List of candidates ordered by score.
> ○ Ability to view each candidate's chat history, profile, and final AI summary.
> ● Persist all data locally so closing/reopening restores progress.
> ● Support pause/resume with a Welcome Back modal.

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies

- **Framework**: React 18 with TypeScript
- **State Management**: Redux Toolkit with Redux Persist
- **Storage**: IndexedDB (via redux-persist)
- **UI Library**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS
- **File Processing**: pdf-parse for PDF extraction, mammoth for DOCX
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Modern web browser with IndexedDB support

### Installation

1. Clone this repository
2. Install dependencies:

```bash
bun install
```

3. Create a `.env` file in the root directory:

```env
VITE_COSMIC_BUCKET_SLUG=your-bucket-slug
VITE_COSMIC_READ_KEY=your-read-key
VITE_COSMIC_WRITE_KEY=your-write-key
```

4. Start the development server:

```bash
bun run dev
```

5. Open your browser to `http://localhost:5173`

## Cosmic CMS Integration

This application uses Cosmic CMS to manage interview configurations and question templates. The following content types are utilized:

### Interview Settings
- Interview duration parameters
- Timer configurations per difficulty level
- Number of questions per difficulty

### Question Banks
- Categorized by difficulty (Easy, Medium, Hard)
- Full-stack development focused questions
- Dynamic question generation templates

### Evaluation Criteria
- Scoring rubrics
- Performance metrics
- AI evaluation guidelines

### Candidate Profiles
- Stored interview sessions
- Performance analytics
- Chat history archives

## Cosmic SDK Examples

```typescript
// Fetch interview configuration
import { cosmic } from './lib/cosmic'

const getInterviewConfig = async () => {
  try {
    const response = await cosmic.objects
      .find({ type: 'interview-settings' })
      .props(['id', 'title', 'metadata'])
      .depth(1)
    
    return response.objects[0]
  } catch (error) {
    if (error.status === 404) {
      return null
    }
    throw error
  }
}

// Fetch question bank by difficulty
const getQuestionsByDifficulty = async (difficulty: string) => {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'questions',
        'metadata.difficulty': difficulty 
      })
      .props(['id', 'title', 'metadata'])
    
    return response.objects
  } catch (error) {
    if (error.status === 404) {
      return []
    }
    throw error
  }
}

// Save candidate interview session
const saveCandidateSession = async (candidateData: any) => {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'candidates',
      title: candidateData.name,
      metadata: {
        email: candidateData.email,
        phone: candidateData.phone,
        score: candidateData.score,
        answers: candidateData.answers,
        summary: candidateData.summary,
        status: 'completed'
      }
    })
    
    return response.object
  } catch (error) {
    throw new Error('Failed to save candidate session')
  }
}
```

## Deployment Options

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard:
   - `VITE_COSMIC_BUCKET_SLUG`
   - `VITE_COSMIC_READ_KEY`
   - `VITE_COSMIC_WRITE_KEY`
4. Deploy

### Netlify

1. Push your code to GitHub
2. Create a new site in Netlify
3. Configure build settings:
   - Build command: `bun run build`
   - Publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy

### Environment Variables

For production deployment, configure these environment variables:

- `VITE_COSMIC_BUCKET_SLUG`: Your Cosmic bucket slug
- `VITE_COSMIC_READ_KEY`: Your Cosmic read key
- `VITE_COSMIC_WRITE_KEY`: Your Cosmic write key

<!-- README_END -->