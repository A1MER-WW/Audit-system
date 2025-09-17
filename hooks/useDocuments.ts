// hooks/useDocuments.ts
import { useState, useEffect } from 'react'

export type Document = {
  id: string
  documentName: string
  description: string
  year: string
  dateUploaded: string
  fileType: string
}

type UseDocumentsOptions = {
  search?: string
  category?: string
  year?: string
}

export function useDocuments(options: UseDocumentsOptions = {}) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      if (options.search) params.append('search', options.search)
      if (options.category) params.append('category', options.category)
      if (options.year) params.append('year', options.year)
      
      const response = await fetch(`/api/documents?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch documents')
      }
      
      const result = await response.json()
      
      if (result.success) {
        setDocuments(result.data)
      } else {
        throw new Error(result.message || 'Failed to fetch documents')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      setDocuments([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [options.search, options.category, options.year])

  const addDocument = async (documentData: Omit<Document, 'id' | 'dateUploaded'>) => {
    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentData),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create document')
      }
      
      const result = await response.json()
      
      if (result.success) {
        // Refresh the documents list
        await fetchDocuments()
        return result.data
      } else {
        throw new Error(result.message || 'Failed to create document')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create document')
      throw err
    }
  }

  return {
    documents,
    loading,
    error,
    refetch: fetchDocuments,
    addDocument
  }
}
