import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { db } from '../services/storage'

const AppContext = createContext()

const initialState = {
  jobs: [],
  candidates: [],
  assessments: [],
  loading: false,
  error: null,
  filters: {
    jobs: { status: 'all', search: '' },
    candidates: { stage: 'all', search: '' }
  }
}

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SET_JOBS':
      return { ...state, jobs: action.payload }
    case 'SET_CANDIDATES':
      return { ...state, candidates: action.payload }
    case 'SET_ASSESSMENTS':
      return { ...state, assessments: action.payload }
    case 'ADD_JOB':
      return { ...state, jobs: [...state.jobs, action.payload] }
    case 'UPDATE_JOB':
      return {
        ...state,
        jobs: state.jobs.map(job =>
          job.id === action.payload.id ? action.payload : job
        )
      }
    case 'UPDATE_CANDIDATE':
      return {
        ...state,
        candidates: state.candidates.map(candidate =>
          candidate.id === action.payload.id ? action.payload : candidate
        )
      }
    case 'SET_FILTER':
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.type]: {
            ...state.filters[action.payload.type],
            ...action.payload.filters
          }
        }
      }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  useEffect(() => {
    // Initialize data from IndexedDB
    const initializeData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true })
        
        const [jobs, candidates, assessments] = await Promise.all([
          db.jobs.toArray(),
          db.candidates.toArray(),
          db.assessments.toArray()
        ])

        dispatch({ type: 'SET_JOBS', payload: jobs })
        dispatch({ type: 'SET_CANDIDATES', payload: candidates })
        dispatch({ type: 'SET_ASSESSMENTS', payload: assessments })
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    initializeData()
  }, [])

  const value = {
    state,
    dispatch
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
