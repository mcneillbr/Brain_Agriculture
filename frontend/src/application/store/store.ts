import { configureStore } from '@reduxjs/toolkit'
import dashboardReducer from './slices/dashboardSlice'
import producersReducer from './slices/producersSlice'
import reportsReducer from './slices/reportsSlice'

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    producers: producersReducer,
    reports: reportsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
