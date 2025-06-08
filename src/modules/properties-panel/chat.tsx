import { generateText } from 'ai'
import { useState } from 'react'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const google = createGoogleGenerativeAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
})

export const Chat = () => {
  const [userMessage, setUserMessage] = useState('')
  const [assistantMessage, setAssistantMessage] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const onUserMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserMessage(e.target.value)
  }

  const onGenerate = async () => {
    setIsGenerating(true)
    const result = await generateText({
      model: google('gemini-2.5-flash-preview-04-17'),
      prompt: userMessage,
    })
    setAssistantMessage(result.text)
    setIsGenerating(false)
  }

  return (
    <div className="px-2 flex flex-col gap-2">
      <Textarea value={userMessage} onChange={onUserMessageChange} />
      <Button onClick={onGenerate} disabled={isGenerating}>Generate</Button>
      <div className="opacity-50 text-sm">{assistantMessage}</div>
    </div>
  )
}
