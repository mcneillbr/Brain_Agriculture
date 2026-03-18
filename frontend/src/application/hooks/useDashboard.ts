'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchDashboard } from '../store/slices/dashboardSlice'

export function useDashboard() {
  const dispatch = useAppDispatch()
  const { data, loading, error } = useAppSelector((state) => state.dashboard)

  useEffect(() => {
    if (!data) {
      dispatch(fetchDashboard())
    }
  }, [dispatch, data])

  return { data, loading, error }
}
