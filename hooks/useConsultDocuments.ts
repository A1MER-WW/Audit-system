// hooks/useConsultDocuments.ts
import { useState, useEffect } from 'react'

export type consultDocumentType = {
  id: number,
  department: string,
  title: string,
  detial: string,
  status: string,
  display:string,
}
type UseConsultDocumentOptions = {
  search?: string
  department?: string
  status?: string
  display?:string,
}

export function useConsultDocuments(options: UseConsultDocumentOptions = {}){
    const [documents, setDocuments] = useState<consultDocumentType[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchDocuments = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      if (options.search) params.append('search', options.search)
      if (options.department) params.append('department', options.department)
      if (options.status) params.append('status', options.status)
      if (options.display) params.append('display', options.display)
      
      const response = await fetch(`/api/consultdocuments?${params.toString()}`)
      
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
  }, [options.search, options.department, options.status, options.status])

  const addDocument = async (documentData: Omit<Document, 'id' | 'dateUploaded'>) => {
      try {
        const response = await fetch('/api/consultdocuments', {
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
