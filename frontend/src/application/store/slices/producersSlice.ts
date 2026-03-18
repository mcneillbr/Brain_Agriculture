import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { CreateProducerDto, ProducerDto, UpdateProducerDto } from '@/domain/types'
import { api } from '@/application/services/api'

interface ProducersState {
  items: ProducerDto[]
  selected: ProducerDto | null
  loading: boolean
  error: string | null
}

const initialState: ProducersState = {
  items: [],
  selected: null,
  loading: false,
  error: null,
}

export const fetchProducers = createAsyncThunk<ProducerDto[]>(
  'producers/fetchAll',
  async () => api.producers.getAll(),
)

export const createProducer = createAsyncThunk<ProducerDto, CreateProducerDto>(
  'producers/create',
  async (dto) => api.producers.create(dto),
)

export const updateProducer = createAsyncThunk<ProducerDto, { id: string; dto: UpdateProducerDto }>(
  'producers/update',
  async ({ id, dto }) => api.producers.update(id, dto),
)

export const deleteProducer = createAsyncThunk<string, string>(
  'producers/delete',
  async (id) => {
    await api.producers.delete(id)
    return id
  },
)

const producersSlice = createSlice({
  name: 'producers',
  initialState,
  reducers: {
    setSelected(state, action: PayloadAction<ProducerDto | null>) {
      state.selected = action.payload
    },
  },
  extraReducers(builder) {
    // fetchAll
    builder.addCase(fetchProducers.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchProducers.fulfilled, (state, action) => {
      state.loading = false
      state.items = action.payload
    })
    builder.addCase(fetchProducers.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? 'Unknown error'
    })
    // create
    builder.addCase(createProducer.fulfilled, (state, action) => {
      state.items.unshift(action.payload)
    })
    // update
    builder.addCase(updateProducer.fulfilled, (state, action) => {
      const idx = state.items.findIndex((p) => p.id === action.payload.id)
      if (idx !== -1) state.items[idx] = action.payload
      if (state.selected?.id === action.payload.id) state.selected = action.payload
    })
    // delete
    builder.addCase(deleteProducer.fulfilled, (state, action) => {
      state.items = state.items.filter((p) => p.id !== action.payload)
      if (state.selected?.id === action.payload) state.selected = null
    })
  },
})

export const { setSelected } = producersSlice.actions
export default producersSlice.reducer
