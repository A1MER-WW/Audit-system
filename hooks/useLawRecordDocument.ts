// hooks/useFaqDocuments.ts
import { useState, useEffect } from 'react'

export type lawRecordDocumentType = {
  id: number,
  department: string,
  title: string,
  detial: string,
  status: string,
  display:string,
}

type UseLawRecordDocumentOptions = {
  id?:number
  search?: string
  department?: string
  status?: string
  display?:string
}

export function useFaqDocuments(options: UseLawRecordDocumentOptions = {}){

}