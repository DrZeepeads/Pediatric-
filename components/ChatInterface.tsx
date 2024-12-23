'use client'

import { useState, useEffect, useRef } from 'react'
import { useChat } from 'ai/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/components/ui/use-toast'

export function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const messagesEndRef = useRef(null)
  const { toast } = useToast()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSearch = async () => {
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      if (!response.ok) throw new Error('Search failed')
      const data = await response.json()
      setSearchResults(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to search PDFs',
        variant: 'destructive',
      })
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="flex gap-2 mb-4">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search PDFs..."
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
        {searchResults.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Search Results:</h3>
            <ul className="list-disc pl-5">
              {searchResults.map((result) => (
                <li key={result.id}>{result.title}</li>
              ))}
            </ul>
          </div>
        )}
        <ScrollArea className="h-[60vh] mb-4">
          {messages.map((m, index) => (
            <div key={index} className={`mb-4 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
              <Card className={`inline-block p-3 ${m.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <p className="whitespace-pre-wrap">{m.content}</p>
              </Card>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            placeholder="Ask about pediatric care..."
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Thinking...' : 'Send'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

