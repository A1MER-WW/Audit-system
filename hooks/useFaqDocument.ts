// hooks/useFaqDocuments.ts
import { useState, useEffect } from 'react'

export type faqDocumentType = {
  id: number,
  type:string
  notificationdate: string,
  department: string,
  category: string,
  title: string,
  issue_question:string,
  issue_answer:string,
  phonenumber:string,
  email:string,
  responsible_person:string,
  status:string,
  display:string,
  craetedate:string,
}


type UseFaqDocumentOptions = {
  id?: number,
  search?: string,
  type?:string,
  notificationdate?: string,
  department?: string,
  category?: string,
  title?: string,
  issue_question?:string,
  phonenumber?:string,
  email?:string,
  responsible_person?:string,
  status?:string,
  display?:string,
  craetedate?:string,
}

export function useFaqDocuments(options: UseFaqDocumentOptions = {}){

  const [documents, setDocuments] = useState<faqDocumentType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (options.id) params.append('id', options.id.toString())
      if (options.search) params.append('search', options.search)
      if (options.type) params.append('type', options.type)
      if (options.department) params.append('department', options.department)
      if (options.status) params.append('status', options.status)
      if (options.display) params.append('display', options.display)

        const response = await fetch(`/api/faqdocuments?${params.toString()}`)
      
        if (!response.ok) {
          throw new Error('Failed to fetch documents')
        }
        
        const result = await response.json()
        
        if (result.success) {
          setDocuments(result.data)
        } else {
          throw new Error(result.message || 'Failed to fetch documents')
        }

    }catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create document')
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [options.search, options.department, options.status, options.status])

  const addDocument = async (documentData: Omit<Document, 'id' | 'dateUploaded'>) => {
      try {
        const response = await fetch('/api/faqdocuments', {
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