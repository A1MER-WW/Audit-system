// hooks/useFaqDocuments.ts
import { useState, useEffect } from 'react'

export type lawRecordDocumentType = {
  id: number,
  category: string,
  type: string,
  url: string,
  status: string,
  display:string,
}

type UseLawRecordDocumentOptions = {
  id?: number,
  search?: string,
  category?: string,
  type?: string,
  url?: string,
  status?: string,
  display?:string,
}

export function useLawRecordDocuments(options: UseLawRecordDocumentOptions = {}){

  const [documents, setDocuments] = useState<lawRecordDocumentType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDocuments = async () => { 
    try{
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (options.id) params.append('id', options.id.toString())
      if (options.search) params.append('search', options.search)
      if (options.category) params.append('search', options.category)
      if (options.type) params.append('type', options.type)
      if (options.url) params.append('department', options.url)
      if (options.status) params.append('status', options.status)
      if (options.display) params.append('display', options.display)

      const response = await fetch(`/api/lawrecorddocument?${params.toString()}`)
      
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
      setError(err instanceof Error ? err.message : 'Failed to create document')
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [options.search, options.category, options.status, options.status])


  return {
        documents,
        loading,
        error,
        refetch: fetchDocuments
    }

}