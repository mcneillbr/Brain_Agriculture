'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchReportData, setFilters } from '../store/slices/reportsSlice'
import type { ReportsFiltersDto } from '@/domain/types'

export function useReports() {
  const dispatch = useAppDispatch()
  const { filters, kpis, farmsByState, areasByCrop, producerReport, loading, error } =
    useAppSelector((state) => state.reports)

  useEffect(() => {
    dispatch(fetchReportData(filters))
    // Initial load only; subsequent fetches are explicit via applyFilters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  return {
    filters,
    kpis,
    farmsByState,
    areasByCrop,
    producerReport,
    loading,
    error,
    applyFilters: (nextFilters: ReportsFiltersDto) => {
      dispatch(setFilters(nextFilters))
      dispatch(fetchReportData(nextFilters))
    },
  }
}
