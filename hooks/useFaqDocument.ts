// hooks/useFaqDocuments.ts
import { useState, useEffect } from 'react'

export type faqDocumentType = {
  id: number,
  department: string,
  title: string,
  detial: string,
  status: string,
  display:string,
}

type UseFaqDocumentOptions = {
  id?:number
  search?: string
  department?: string
  status?: string
  display?:string
}

export function useFaqDocuments(options: UseFaqDocumentOptions = {}){

}