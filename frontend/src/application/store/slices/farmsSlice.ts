import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { FarmDto } from '@/domain/types'
import { api } from '@/application/services/api'

interface FarmsState {
  items: FarmDto[]
  selected: FarmDto | null
  loading: boolean
  error: string | null
}

const initialState: FarmsState = {
  items: [],
  selected: null,
  loading: false,
  error: null,
}

export const fetchFarms = createAsyncThunk<FarmDto[]>(
  'farms/fetchAll',
  async () => api.farms.getAll(),
)

export const fetchFarmById = createAsyncThunk<FarmDto, string>(
  'farms/fetchById',
  async (id) => api.farms.getById(id),
)

const farmsSlice = createSlice({
  name: 'farms',
  initialState,
  reducers: {
    setSelected(state, action: PayloadAction<FarmDto | null>) {
      state.selected = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchFarms.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchFarms.fulfilled, (state, action) => {
      state.loading = false
      state.items = action.payload
    })
    builder.addCase(fetchFarms.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? 'Unknown error'
    })

    builder.addCase(fetchFarmById.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchFarmById.fulfilled, (state, action) => {
      state.loading = false
      state.selected = action.payload
      const idx = state.items.findIndex((farm) => farm.id === action.payload.id)
      if (idx === -1) {
        state.items.push(action.payload)
      } else {
        state.items[idx] = action.payload
      }
    })
    builder.addCase(fetchFarmById.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? 'Unknown error'
    })
  },
})

export const { setSelected } = farmsSlice.actions
export default farmsSlice.reducer
