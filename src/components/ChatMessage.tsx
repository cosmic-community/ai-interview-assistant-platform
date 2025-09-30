import { ChatMessage as ChatMessageType } from '../types'
import { cn } from '../lib/utils'

interface ChatMessageProps {
  message: ChatMessageType
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.type === 'user'
  const isSystem = message.type === 'system'

  return (
    <div
      className={cn(
        'flex',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'rounded-lg px-4 py-2 max-w-[80%]',
          isUser && 'bg-primary text-primary-foreground',
          isSystem && 'bg-muted text-muted-foreground',
          !isUser && !isSystem && 'bg-secondary text-secondary-foreground'
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <p className="text-xs opacity-70 mt-1">
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  )
}