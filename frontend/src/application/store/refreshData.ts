import type { AppDispatch, RootState } from './store'
import { fetchDashboard } from './slices/dashboardSlice'
import { fetchProducers } from './slices/producersSlice'
import { fetchReportData } from './slices/reportsSlice'

interface RefreshDerivedDataOptions {
  includeProducers?: boolean
}

export function refreshDerivedData(
  { includeProducers = true }: RefreshDerivedDataOptions = {},
) {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const { filters } = getState().reports
    const refreshTasks: Promise<unknown>[] = [
      dispatch(fetchDashboard()).unwrap(),
      dispatch(fetchReportData(filters)).unwrap(),
    ]

    if (includeProducers) {
      refreshTasks.push(dispatch(fetchProducers()).unwrap())
    }

    await Promise.all(refreshTasks)
  }
}