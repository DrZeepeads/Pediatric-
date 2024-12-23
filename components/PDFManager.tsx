'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/components/AuthProvider'

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// )

export function PDFManager() {
  const { supabase } = useAuth()
  const [pdfs, setPdfs] = useState([])
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    fetchPDFs()
  }, [])

  const fetchPDFs = async () => {
    if (!supabase) {
      toast({
        title: 'Error',
        description: 'Unable to initialize Supabase client',
        variant: 'destructive',
      })
      return
    }
    const { data, error } = await supabase
      .from('pdf_files')
      .select('*')
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch PDFs',
        variant: 'destructive',
      })
    } else {
      setPdfs(data)
    }
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file || !title || !supabase) return

    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('pdfs')
      .upload(filePath, file)

    if (uploadError) {
      toast({
        title: 'Error',
        description: 'Error uploading file',
        variant: 'destructive',
      })
      return
    }

    const { data: urlData } = supabase.storage
      .from('pdfs')
      .getPublicUrl(filePath)

    const { error: insertError } = await supabase
      .from('pdf_files')
      .insert({ title, url: urlData.publicUrl })

    if (insertError) {
      toast({
        title: 'Error',
        description: 'Error inserting PDF data',
        variant: 'destructive',
      })
      return
    }

    setFile(null)
    setTitle('')
    fetchPDFs()
    toast({
      title: 'Success',
      description: 'PDF uploaded successfully',
    })
  }

  const handleSearch = async () => {
    if (!supabase) {
      toast({
        title: 'Error',
        description: 'Unable to initialize Supabase client',
        variant: 'destructive',
      })
      return
    }
    const { data, error } = await supabase
      .from('pdf_files')
      .select('*')
      .ilike('title', `%${searchQuery}%`)

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to search PDFs',
        variant: 'destructive',
      })
    } else {
      setPdfs(data)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>PDF Management</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpload} className="space-y-4">
          <Input type="file" accept=".pdf" onChange={handleFileChange} />
          <Input
            type="text"
            placeholder="PDF Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button type="submit">Upload PDF</Button>
        </form>
        <div className="mt-6">
          <div className="flex gap-2 mb-4">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search PDFs..."
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>
          <h3 className="text-lg font-semibold mb-2">Uploaded PDFs</h3>
          {pdfs.map((pdf) => (
            <div key={pdf.id} className="flex justify-between items-center mb-2">
              <span>{pdf.title}</span>
              <a href={pdf.url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">View</Button>
              </a>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

