import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { api } from '@/application/services/api'
import type {
  AreasByCropDto,
  FarmsByStateDto,
  ProducerReportRowDto,
  ReportsFiltersDto,
  ReportsKpisDto,
} from '@/domain/types'

interface ReportsState {
  filters: ReportsFiltersDto
  kpis: ReportsKpisDto
  farmsByState: FarmsByStateDto[]
  areasByCrop: AreasByCropDto[]
  producerReport: ProducerReportRowDto[]
  loading: boolean
  error: string | null
}

const initialState: ReportsState = {
  filters: { harvestId: null, state: null },
  kpis: {
    totalProducers: 0,
    totalFarms: 0,
    totalArea: 0,
    avgAreaPerFarm: 0,
  },
  farmsByState: [],
  areasByCrop: [],
  producerReport: [],
  loading: false,
  error: null,
}

export const fetchReportData = createAsyncThunk(
  'reports/fetchData',
  async (filters: ReportsFiltersDto) => api.reports.getData(filters),
)

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<ReportsFiltersDto>) {
      state.filters = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchReportData.pending, (state) => {
      state.loading = true
      state.error = null
    })

    builder.addCase(fetchReportData.fulfilled, (state, action) => {
      state.loading = false
      state.kpis = action.payload.kpis
      state.farmsByState = action.payload.farmsByState
      state.areasByCrop = action.payload.areasByCrop
      state.producerReport = action.payload.producerReport
    })

    builder.addCase(fetchReportData.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? 'Erro ao carregar relatórios'
    })
  },
})

export const { setFilters } = reportsSlice.actions
export default reportsSlice.reducer
