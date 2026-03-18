import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { DashboardDto } from '@/domain/types'
import { api } from '@/application/services/api'

interface DashboardState {
  data: DashboardDto | null
  loading: boolean
  error: string | null
}

const initialState: DashboardState = {
  data: null,
  loading: false,
  error: null,
}

export const fetchDashboard = createAsyncThunk<DashboardDto>(
  'dashboard/fetch',
  async () => api.dashboard(),
)

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Unknown error'
      })
  },
})

export default dashboardSlice.reducer
